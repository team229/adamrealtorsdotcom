import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import {
  homeValuationHref,
  nav,
  neighborhoodNewsHref,
  site,
} from '@/data/site';

interface HeaderProps {
  /** Current pathname, used to highlight the active nav item. */
  pathname: string;
}

/** Nav groups that always render with the gold "accent" treatment. */
const ACCENT_GROUPS = new Set(['Buy', 'Get a Mortgage']);

const normalize = (value: string) => value.replace(/\/+$/, '') || '/';

export default function Header({ pathname }: HeaderProps) {
  const current = normalize(pathname);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close the desktop dropdown when the viewport shrinks to the mobile layout.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setMobileOpen(false);
        setMobileGroup(null);
      }
    };
    onChange(mq);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const isGroupActive = (group: (typeof nav)[number]) =>
    current === normalize(group.href) ||
    (group.items ?? []).some((item) => current === normalize(item.href));

  const openWithDelayClose = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background shadow-sm transition-all duration-500">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center gap-3">
          {/* Brand lockup — always links home. */}
          <a
            href="/"
            aria-label="Adam the Realtor — homepage"
            className="flex shrink-0 items-center"
          >
            <span
              className="inline text-[17px] font-bold text-foreground sm:text-lg"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Adam the Realtor
            </span>
          </a>

          <nav
            className="ml-auto hidden items-center gap-0.5 lg:flex"
            aria-label="Main navigation"
          >
            {nav.map((group) =>
              group.items && group.items.length > 0 ? (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => openWithDelayClose(group.label)}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu((prev) =>
                        prev === group.label ? null : group.label,
                      )
                    }
                    aria-expanded={openMenu === group.label}
                    aria-haspopup="menu"
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors ${
                      ACCENT_GROUPS.has(group.label)
                        ? 'bg-accent text-white hover:bg-accent/90'
                        : `hover:bg-secondary hover:text-primary ${
                            isGroupActive(group)
                              ? 'text-primary'
                              : 'text-foreground'
                          }`
                    }`}
                  >
                    {group.label}
                    <ChevronDown
                      size={15}
                      className={`transition-transform ${
                        openMenu === group.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openMenu === group.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.16 }}
                        role="menu"
                        className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-border bg-card p-2 shadow-xl"
                      >
                        {group.items.map((item) =>
                          item.external ? (
                            <a
                              key={item.label}
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              role="menuitem"
                              onClick={() => setOpenMenu(null)}
                              className="block rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary"
                            >
                              {item.label}
                            </a>
                          ) : (
                            <a
                              key={item.label}
                              href={item.href}
                              role="menuitem"
                              onClick={() => setOpenMenu(null)}
                              className={`block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-secondary hover:text-primary ${
                                current === normalize(item.href)
                                  ? 'bg-secondary font-semibold text-primary'
                                  : 'text-foreground'
                              }`}
                            >
                              {item.label}
                            </a>
                          ),
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <a
                  key={group.label}
                  href={group.href}
                  aria-current={current === normalize(group.href) ? 'page' : undefined}
                  className={`rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors hover:bg-secondary hover:text-primary ${
                    current === normalize(group.href) ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {group.label}
                </a>
              ),
            )}

            <a
              href={neighborhoodNewsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-2.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary hover:text-primary"
            >
              Neighborhood News
            </a>
            <a
              href={homeValuationHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-3 py-2 text-sm font-semibold bg-accent text-white transition-colors hover:bg-accent/90"
            >
              Home Valuation
            </a>
            <a
              className={`rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors hover:bg-secondary hover:text-primary ${
                pathname === '/contact' ? 'text-primary' : 'text-primary'
              }`}
              href="/contact/"
            >
              Contact Adam
            </a>
          </nav>

          {/* Sticky call button — icon-only on small screens, full number on larger. */}
          <a
            href={site.phoneHref}
            aria-label={`Call Adam at ${site.phone}`}
            className="ml-auto inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 lg:px-3 xl:ml-2 xl:px-4"
          >
            <Phone size={15} aria-hidden="true" />
            <span className="hidden sm:inline lg:hidden xl:inline">{site.phone}</span>
          </a>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="-mr-1 rounded-lg p-2 text-foreground transition-colors hover:bg-secondary hover:text-primary lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-border bg-background lg:hidden"
          >
            <nav
              className="container mx-auto px-4 py-4 sm:px-6"
              aria-label="Mobile navigation"
            >
              <div className="divide-y divide-border">
                {nav.map((group) =>
                  group.items && group.items.length > 0 ? (
                    <div key={group.label} className="py-1">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileGroup((prev) =>
                            prev === group.label ? null : group.label,
                          )
                        }
                        className="flex w-full items-center justify-between py-3 text-left text-base font-semibold text-foreground"
                        aria-expanded={mobileGroup === group.label}
                      >
                        {group.label}
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${
                            mobileGroup === group.label ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileGroup === group.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pb-3"
                          >
                            {group.items.map((item) =>
                              item.external ? (
                                <a
                                  key={item.label}
                                  href={item.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setMobileOpen(false)}
                                  className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-primary"
                                >
                                  {item.label}
                                </a>
                              ) : (
                                <a
                                  key={item.label}
                                  href={item.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-primary"
                                >
                                  {item.label}
                                </a>
                              ),
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <a
                      key={group.label}
                      href={group.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-4 text-base font-semibold text-foreground hover:text-primary"
                    >
                      {group.label}
                    </a>
                  ),
                )}

                <a
                  href={neighborhoodNewsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="block py-4 text-base font-semibold text-foreground hover:text-primary"
                >
                  Neighborhood News
                </a>
                <a
                  href={homeValuationHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="block py-4 text-base font-semibold text-accent hover:text-accent/80"
                >
                  Home Valuation
                </a>
                <a
                  href={site.phoneHref}
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-base font-semibold text-primary-foreground"
                >
                  <Phone size={17} aria-hidden="true" />
                  Call {site.phone}
                </a>
                <a
                  href="/contact/"
                  onClick={() => setMobileOpen(false)}
                  className="block py-4 text-base font-semibold text-primary"
                >
                  Contact Adam
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
