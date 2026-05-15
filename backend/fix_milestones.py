from app import create_app, db
from app.models.order import Order, OrderMilestone

app = create_app()
with app.app_context():
    orders = Order.query.all()
    for order in orders:
        # Ensure step_order is set correctly
        milestones = sorted(order.milestones.all(), key=lambda x: x.id)
        for idx, m in enumerate(milestones):
            m.step_order = idx
            
        # Fix consistency: if a later step is done, all previous must be done.
        # But if the user wants to "reduce" status, they want the latest done ones to be undone.
        # We'll just enforce consistency based on the highest completed step.
        
        # Actually, let's just make it so if any step is uncompleted, all subsequent are uncompleted.
        # Find the first uncompleted step.
        first_uncompleted = -1
        sorted_m = sorted(milestones, key=lambda x: x.step_order)
        for m in sorted_m:
            if not m.completed:
                first_uncompleted = m.step_order
                break
        
        if first_uncompleted != -1:
            for m in sorted_m:
                if m.step_order > first_uncompleted and m.completed:
                    print(f"Fixing Order {order.order_id}: Uncompleting {m.label}")
                    m.completed = False
                    m.completed_at = None
        
    db.session.commit()
    print("Database consistency check complete.")
