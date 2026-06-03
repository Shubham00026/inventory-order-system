from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    # Validate customer
    customer = db.query(models.Customer).filter(
        models.Customer.id == order.customer_id
    ).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    if not order.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    total_amount = 0.0
    validated_items = []

    # Validate stock & calculate total
    for item in order.items:
        product = db.query(models.Product).filter(
            models.Product.id == item.product_id
        ).first()
        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product with id {item.product_id} not found"
            )
        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for product '{product.name}'. "
                       f"Available: {product.quantity}, Requested: {item.quantity}"
            )
        total_amount += product.price * item.quantity
        validated_items.append((product, item.quantity, product.price))

    # Create order
    new_order = models.Order(customer_id=order.customer_id, total_amount=total_amount)
    db.add(new_order)
    db.flush()  # get order id

    # Create items & reduce stock
    for product, qty, unit_price in validated_items:
        db.add(models.OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=qty,
            unit_price=unit_price
        ))
        product.quantity -= qty

    db.commit()
    db.refresh(new_order)
    return new_order


@router.get("", response_model=List[schemas.OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).order_by(models.Order.id).all()


@router.get("/{order_id}", response_model=schemas.OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Restore stock when order is cancelled
    for item in order.items:
        product = db.query(models.Product).filter(
            models.Product.id == item.product_id
        ).first()
        if product:
            product.quantity += item.quantity

    db.delete(order)
    db.commit()
    return None