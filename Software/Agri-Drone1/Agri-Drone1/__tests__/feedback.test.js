require('@testing-library/jest-dom');
const { fireEvent, screen, waitFor } = require('@testing-library/dom');
const { rest } = require('msw');
const { setupServer } = require('msw/node');

// Mock HTML structure (minimal for modal and feedbacks)
document.body.innerHTML = `
  <button class="cta-btn" id="open-demo-modal">Feedback</button>
  <div id="demo-modal" class="modal-overlay" style="display:none;">
    <div class="modal-content">
      <button class="modal-close" id="close-demo-modal" title="Close">&times;</button>
      <form id="demo-form">
        <input type="text" id="demo-name" name="name" required />
        <input type="email" id="demo-email" name="email" />
        <textarea id="demo-message" name="message" required></textarea>
        <div id="star-rating">
          <span data-star="1">☆</span><span data-star="2">☆</span><span data-star="3">☆</span><span data-star="4">☆</span><span data-star="5">☆</span>
        </div>
        <input type="hidden" id="demo-rating" name="rating" required />
        <button type="submit" class="cta-btn">Submit</button>
        <div id="demo-form-msg"></div>
      </form>
    </div>
  </div>
  <button class="cta-btn" id="get-feedbacks-btn">Get Feedbacks</button>
  <div id="feedbacks-list"></div>
`;

// Mock API handlers
const server = setupServer(
  rest.post('http://localhost:3001/api/feedback', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
  rest.get('http://localhost:3001/api/get-feedbacks', (req, res, ctx) => {
    return res(ctx.json([
      { name: 'Alice', message: 'Great!', rating: 5, timestamp: new Date().toISOString() },
      { name: 'Bob', message: 'Okay', rating: 3, timestamp: new Date().toISOString() }
    ]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Simulate modal logic (minimal, as in your script)
function setupModalLogic() {
  const openModalBtn = document.getElementById('open-demo-modal');
  const closeModalBtn = document.getElementById('close-demo-modal');
  const modal = document.getElementById('demo-modal');
  const form = document.getElementById('demo-form');
  const msg = document.getElementById('demo-form-msg');
  const starRating = document.getElementById('star-rating');
  const ratingInput = document.getElementById('demo-rating');
  let selectedRating = 0;

  if (starRating) {
    starRating.addEventListener('mouseover', e => {
      if (e.target.dataset.star) {
        const val = parseInt(e.target.dataset.star);
        Array.from(starRating.children).forEach((s, i) => {
          s.textContent = i < val ? '★' : '☆';
        });
      }
    });
    starRating.addEventListener('mouseout', () => {
      Array.from(starRating.children).forEach((s, i) => {
        s.textContent = i < selectedRating ? '★' : '☆';
      });
    });
    starRating.addEventListener('click', e => {
      if (e.target.dataset.star) {
        selectedRating = parseInt(e.target.dataset.star);
        ratingInput.value = selectedRating;
        Array.from(starRating.children).forEach((s, i) => {
          s.textContent = i < selectedRating ? '★' : '☆';
          s.className = i < selectedRating ? 'star-selected' : '';
        });
      }
    });
  }

  if (openModalBtn && closeModalBtn && modal) {
    openModalBtn.onclick = () => { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; };
    closeModalBtn.onclick = () => { modal.style.display = 'none'; document.body.style.overflow = ''; msg.textContent = ''; };
  }

  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      msg.textContent = '';
      const name = document.getElementById('demo-name').value.trim();
      const email = document.getElementById('demo-email').value.trim();
      const message = document.getElementById('demo-message').value.trim();
      const rating = parseInt(ratingInput.value);
      if (!name || !message || !rating) {
        msg.style.color = 'red';
        msg.textContent = 'Please fill all required fields and select a rating.';
        return;
      }
      const payload = { name, email, message, rating };
      try {
        const res = await fetch('http://localhost:3001/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          msg.style.color = 'var(--green)';
          msg.textContent = 'Thank you for your feedback!';
          form.reset();
          selectedRating = 0;
          Array.from(starRating.children).forEach((s, i) => { s.textContent = '☆'; s.className = ''; });
        } else {
          msg.style.color = 'red';
          msg.textContent = data.error || 'Submission failed.';
        }
      } catch (err) {
        msg.style.color = 'red';
        msg.textContent = 'Network error. Please try again.';
      }
    };
  }
}

setupModalLogic();

// --- TESTS ---
describe('Feedback Modal and API', () => {
  test('opens and closes modal', () => {
    const openBtn = screen.getByText('Feedback');
    const modal = document.getElementById('demo-modal');
    expect(modal.style.display).toBe('none');
    fireEvent.click(openBtn);
    expect(modal.style.display).toBe('flex');
    fireEvent.click(document.getElementById('close-demo-modal'));
    expect(modal.style.display).toBe('none');
  });

  test('validates required fields and star rating', async () => {
    fireEvent.click(screen.getByText('Feedback'));
    const form = document.getElementById('demo-form');
    fireEvent.input(document.getElementById('demo-name'), { target: { value: '' } });
    fireEvent.input(document.getElementById('demo-message'), { target: { value: '' } });
    document.getElementById('demo-rating').value = '';
    fireEvent.submit(form);
    expect(document.getElementById('demo-form-msg')).toHaveTextContent('Please fill all required fields');
  });

  test('submits feedback and shows success', async () => {
    fireEvent.click(screen.getByText('Feedback'));
    fireEvent.input(document.getElementById('demo-name'), { target: { value: 'Test User' } });
    fireEvent.input(document.getElementById('demo-message'), { target: { value: 'Nice!' } });
    // Simulate star click
    fireEvent.click(screen.getByText('☆', { selector: '[data-star="5"]' }));
    fireEvent.submit(document.getElementById('demo-form'));
    await waitFor(() => expect(document.getElementById('demo-form-msg')).toHaveTextContent('Thank you for your feedback!'));
  });

  test('fetches and displays feedbacks', async () => {
    fireEvent.click(screen.getByText('Get Feedbacks'));
    await waitFor(() => expect(document.getElementById('feedbacks-list')).toHaveTextContent('Alice'));
    expect(document.getElementById('feedbacks-list')).toHaveTextContent('Great!');
    expect(document.getElementById('feedbacks-list')).toHaveTextContent('Bob');
    expect(document.getElementById('feedbacks-list')).toHaveTextContent('Okay');
  });
}); 