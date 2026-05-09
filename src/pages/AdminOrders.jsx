import React from 'react';
import AdminOrderRequests from '@/components/AdminOrderRequests';

export default function AdminOrders() {
  return (
    <div className="flex-1 overflow-auto bg-[#fafbff] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-foreground">Order Requests</h1>
          <p className="text-muted-foreground font-medium">Monitor and update customer 3D printing milestones</p>
        </div>
        <AdminOrderRequests />
      </div>
    </div>
  );
}
