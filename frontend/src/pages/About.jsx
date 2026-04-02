import React from 'react';

const team = [
  { name: 'Ahmed Hassan', role: 'CEO & Founder', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { name: 'Sara Mohamed', role: 'Head of Design', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
  { name: 'Omar Ali', role: 'Lead Developer', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
];

const About = () => (
  <>
    {/* Hero */}
    <section style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', color: '#fff', padding: '80px 0' }}>
      <div className="container text-center">
        <h1 className="display-4 fw-bold mb-3">About <span style={{ color: '#e94560' }}>ShopZone</span></h1>
        <p className="fs-5 text-white-50 mx-auto" style={{ maxWidth: 600 }}>
          We're passionate about connecting customers with quality products at great prices.
        </p>
      </div>
    </section>

    {/* Story */}
    <section className="py-5">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-md-6">
            <h2 className="section-title">Our Story</h2>
            <div className="section-divider" style={{ margin: '8px 0 20px' }}></div>
            <p className="text-muted">
              ShopZone was founded in 2025 with a simple mission: make online shopping
              easy, fast, and enjoyable for everyone. We started as a small team of
              passionate developers and designers, and have grown into a full-featured
              e-commerce platform serving thousands of customers.
            </p>
            <p className="text-muted">
              We believe that great products should be accessible to everyone. That's why
              we partner with trusted suppliers to bring you quality items at competitive prices,
              with fast delivery and hassle-free returns.
            </p>
          </div>
          <div className="col-md-6">
            <div className="row g-3">
              {[
                { icon: 'bi-people-fill', num: '10K+', label: 'Happy Customers' },
                { icon: 'bi-box-seam', num: '500+', label: 'Products' },
                { icon: 'bi-truck', num: '99%', label: 'On-Time Delivery' },
                { icon: 'bi-star-fill', num: '4.8', label: 'Avg. Rating' },
              ].map((s, i) => (
                <div key={i} className="col-6">
                  <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
                    <i className={`bi ${s.icon} fs-2 text-danger mb-2`}></i>
                    <h3 className="fw-bold mb-0">{s.num}</h3>
                    <p className="text-muted small mb-0">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="section-title">Meet the Team</h2>
        <div className="section-divider"></div>
        <div className="row g-4 justify-content-center">
          {team.map((member, i) => (
            <div key={i} className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <img src={member.img} alt={member.name} className="rounded-circle mb-3"
                  style={{ width: 80, height: 80, objectFit: 'cover', margin: '0 auto' }} />
                <h6 className="fw-bold mb-0">{member.name}</h6>
                <p className="text-muted small">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default About;
