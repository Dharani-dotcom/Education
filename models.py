class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    timing = db.Column(db.String(100), nullable=False)   # New
    meeting_link = db.Column(db.String(250), nullable=False)  # Zoom/GMeet link

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    status = db.Column(db.String(50), default="Pending")
    paid = db.Column(db.Boolean, default=False)          # New
    user = db.relationship('User', backref='bookings')
    course = db.relationship('Course', backref='bookings')
