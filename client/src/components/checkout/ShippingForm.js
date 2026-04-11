import React from "react";
import Input from "../common/Input";
import Button from "../common/Button";

const ShippingForm = ({ address, onChange, onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.zip || !address.country) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
      <Input label="Street Address" value={address.street}
        onChange={(e) => onChange({ ...address, street: e.target.value })} placeholder="123 Main St" required />
      <div className="grid grid-cols-2 gap-4">
        <Input label="City" value={address.city}
          onChange={(e) => onChange({ ...address, city: e.target.value })} placeholder="New York" required />
        <Input label="State" value={address.state}
          onChange={(e) => onChange({ ...address, state: e.target.value })} placeholder="NY" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="ZIP Code" value={address.zip}
          onChange={(e) => onChange({ ...address, zip: e.target.value })} placeholder="10001" required />
        <Input label="Country" value={address.country}
          onChange={(e) => onChange({ ...address, country: e.target.value })} placeholder="US" required />
      </div>
      <Button type="submit" className="w-full mt-4">Continue to Payment</Button>
    </form>
  );
};

export default ShippingForm;
