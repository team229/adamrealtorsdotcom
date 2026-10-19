import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, ChevronDown, Mail, Send } from 'lucide-react';
import { contact, site } from '@/data/site';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const ENDPOINT = import.meta.env.PUBLIC_CONTACT_ENDPOINT as string | undefined;

const fieldBase =
  'w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

const labelBase =
  'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [openTopics, setOpenTopics] = useState(false);
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
    consent: false,
  });

  const update = (key: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target;
    setValues((prev) => ({
      ...prev,
      [key]: target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value,
    }));
  };

  const toggleTopic = (label: string) => {
    setSelectedTopics((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const buildPayload = () => ({
    first_name: values.firstName,
    last_name: values.lastName,
    phone: values.phone,
    email: values.email,
    message: values.message,
    inquiry_types: selectedTopics,
    source: 'adamtherealtor.com/contact',
  });

  const fallbackMailto = () => {
    const subject = encodeURIComponent(
      `New inquiry from ${values.firstName} ${values.lastName}`.trim(),
    );
    const body = encodeURIComponent(
      [
        `Name: ${values.firstName} ${values.lastName}`,
        `Phone: ${values.phone}`,
        `Email: ${values.email}`,
        `I'm interested in: ${selectedTopics.join(', ') || 'General question'}`,
        '',
        values.message,
      ].join('\n'),
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setError('');

    if (!ENDPOINT) {
      // No backend wired up yet — hand the lead to the visitor's mail client
      // rather than silently dropping the message.
      fallbackMailto();
      setStatus('sent');
      return;
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });
      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      setStatus('sent');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      );
      setStatus('error');
    }
  };

  return (
    <div className="p-5 md:p-6">
      <AnimatePresence mode="wait">
        {status === 'sent' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-3 py-16 text-center"
          >
            <CheckCircle2 className="h-12 w-12 text-primary" strokeWidth={1.5} />
            <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              Message Sent!
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              Thanks for reaching out. Adam will personally respond within 2 hours
              during business hours.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus('idle');
                setValues({
                  firstName: '',
                  lastName: '',
                  phone: '',
                  email: '',
                  message: '',
                  consent: false,
                });
                setSelectedTopics([]);
              }}
              className="mt-2 rounded-lg px-4 py-2 text-sm font-semibold text-primary underline-offset-4 transition-colors hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelBase} htmlFor="first_name">
                  First Name <span className="text-accent">*</span>
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  autoComplete="given-name"
                  placeholder="Enter your first name"
                  value={values.firstName}
                  onChange={update('firstName')}
                  className={fieldBase}
                />
              </div>
              <div>
                <label className={labelBase} htmlFor="last_name">
                  Last Name <span className="text-accent">*</span>
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  autoComplete="family-name"
                  placeholder="Enter your last name"
                  value={values.lastName}
                  onChange={update('lastName')}
                  className={fieldBase}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelBase} htmlFor="phone">
                  Phone <span className="text-accent">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="+1 (555) 000-0000"
                  value={values.phone}
                  onChange={update('phone')}
                  className={fieldBase}
                />
              </div>
              <div>
                <label className={labelBase} htmlFor="email">
                  Email <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={values.email}
                    onChange={update('email')}
                    className={`${fieldBase} pl-9`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelBase} id="inquiry-type-label">
                What can I help you with? <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenTopics((prev) => !prev)}
                  aria-expanded={openTopics}
                  aria-labelledby="inquiry-type-label"
                  className={`${fieldBase} flex items-center justify-between text-left`}
                >
                  <span
                    className={
                      selectedTopics.length ? 'text-foreground' : 'text-muted-foreground/70'
                    }
                  >
                    {selectedTopics.length
                      ? selectedTopics.join(', ')
                      : 'Choose one or more options'}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-muted-foreground transition-transform ${
                      openTopics ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openTopics && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-xl"
                    >
                      {contact.inquiryTypes.map((topic) => {
                        const active = selectedTopics.includes(topic.label);
                        return (
                          <li key={topic.id}>
                            <button
                              type="button"
                              onClick={() => toggleTopic(topic.label)}
                              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-secondary ${
                                active
                                  ? 'bg-secondary font-semibold text-primary'
                                  : 'text-foreground'
                              }`}
                            >
                              <span
                                className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                                  active
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-input'
                                }`}
                              >
                                {active && (
                                  <svg
                                    viewBox="0 0 24 24"
                                    className="h-3 w-3"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M20 6 9 17l-5-5" />
                                  </svg>
                                )}
                              </span>
                              {topic.label}
                            </button>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div>
              <label className={labelBase} htmlFor="message">
                Message <span className="text-accent">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Type your message here"
                value={values.message}
                onChange={update('message')}
                className={`${fieldBase} resize-y`}
              />
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
              <input
                type="checkbox"
                name="terms_and_conditions"
                checked={values.consent}
                onChange={update('consent')}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-primary"
              />
              <span>
                By checking this box, I consent to receive non-marketing text messages
                from Adam Shaaban, Century 21 Affiliated, at the phone number provided,
                regarding my real estate inquiry and requested services. Message
                frequency varies, message &amp; data rates may apply. Text HELP for
                assistance, reply STOP to opt out.
              </span>
            </label>

            {status === 'error' && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'sending' ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Submit
                </>
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              No spam, ever. Your info stays private.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
