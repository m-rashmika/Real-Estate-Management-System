--INDEXES
CREATE INDEX idx_property_city ON Property(City);
CREATE INDEX idx_property_area ON Property(Area);
CREATE INDEX idx_property_type ON Property(Type);
CREATE INDEX idx_lease_end_date ON Lease_Agreement (End_date);
CREATE INDEX idx_roles_role ON Roles(Role);
CREATE INDEX idx_staff_availability ON staff (availability);
CREATE INDEX idx_staff_service ON staff (service);
CREATE INDEX idx_staff_service_availability ON staff (service, availability);
