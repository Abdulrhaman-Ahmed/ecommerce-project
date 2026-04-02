import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', color: '#fff', padding: '80px 0' }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Contact <span style={{ color: '#e94560' }}>Us</span></h1>
          <p className="fs-5 text-white-50">We'd love to hear from you. Send us a message!</p>
        </div>
      </section>

      <div className="container py-5">
        <div className="row g-5">
          <div className="col-md-4">
            <h4 className="fw-bold mb-4">Get in Touch</h4>
            {[
              { icon: 'bi-geo-alt-fill', title: 'Address', text: '123 Main Street, Cairo, Egypt' },
              { icon: 'bi-envelope-fill', title: 'Email', text: 'support@shopzone.com' },
              { icon: 'bi-telephone-fill', title: 'Phone', text: '+20 100 000 0000' },
              { icon: 'bi-clock-fill', title: 'Hours', text: 'Mon-Fri: 9am - 6pm' },
            ].map((info, i) => (
              <div key={i} className="d-flex gap-3 mb-4">
                <div style={{
                  width: 44, height: 44, minWidth: 44,
                  background: '#e94560', borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className={`bi ${info.icon} text-white`}></i>
                </div>
                <div>
                  <p className="fw-bold mb-0 small">{info.title}</p>
                  <p className="text-muted small mb-0">{info.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-8">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              {sent && (
                <div className="alert alert-success rounded-3 mb-4">
                  <i className="bi bi-check-circle me-2"></i>
                  Your message was sent successfully!
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input className="form-control" id="name" placeholder="Name" value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })} required />
                      <label htmlFor="name">Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input type="email" className="form-control" id="email" placeholder="Email" value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })} required />
                      <label htmlFor="email">Email</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input className="form-control" id="subject" placeholder="Subject" value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })} required />
                      <label htmlFor="subject">Subject</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea className="form-control" id="message" placeholder="Message" style={{ minHeight: '120px' }} value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })} required></textarea>
                      <label htmlFor="message">Message</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-dark rounded-pill px-5">
                      <i className="bi bi-send me-2"></i>Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
