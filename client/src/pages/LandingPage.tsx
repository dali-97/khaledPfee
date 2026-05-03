import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Download,
  FileText,
  Menu,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";
import { benefitCards, heroMetrics } from "@/data/mission-flow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InfoPair,
  MetricSurface,
  SectionHeading,
  ThemeToggleButton,
} from "@/components/mission-flow/primitives";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

function SpotlightCard({
  children,
  color = "99, 102, 241",
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, show: false });

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-transform duration-300 hover:-translate-y-1 ${className}`}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top, show: true });
      }}
      onMouseLeave={() => setPos((p) => ({ ...p, show: false }))}
    >
      <div
        className="pointer-events-none absolute inset-0 hidden rounded-[inherit] transition-opacity duration-300 dark:block"
        style={{
          opacity: pos.show ? 1 : 0,
          background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, rgba(${color}, 0.12), transparent 60%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-[-1px] hidden rounded-[inherit] transition-opacity duration-300 dark:block"
        style={{
          opacity: pos.show ? 1 : 0,
          padding: "1px",
          background: `radial-gradient(200px circle at ${pos.x}px ${pos.y}px, rgba(${color}, 0.7), transparent 60%)`,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {children}
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useUIStore();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = Boolean(user);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleGetStarted = () => {
    navigate(isAuthenticated ? "/workspace" : "/login");
  };

  return (
    <div className="relative">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center leading-none">
              <span className="text-2xl font-extrabold tracking-tight text-[#3b3598]">
                SEBN
              </span>
              <span className="mx-0.5 mb-0.5 inline-block h-4 w-1.5 translate-y-0.5 rounded-sm bg-gray-400" />
              <span className="text-2xl font-extrabold tracking-tight text-[#3b3598]">
                TN
              </span>
            </div>
          </div>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#home" className="transition hover:text-foreground">
              Home
            </a>
            <a href="#missions" className="transition hover:text-foreground">
              Missions
            </a>
            <a href="#about" className="transition hover:text-foreground">
              About Us
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggleButton theme={theme} onClick={toggleTheme} />
            {!isAuthenticated ? (
              <Button
                variant="outline"
                className="hidden md:inline-flex"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            ) : null}
            <Button className="hidden md:inline-flex" onClick={handleGetStarted}>
              Get Started
            </Button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card text-foreground transition hover:bg-accent md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden">
            <nav className="container flex flex-col py-4">
              {[
                { label: "Home", href: "#home" },
                { label: "Missions", href: "#missions" },
                { label: "About Us", href: "#about" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-border/60 pt-3">
                {!isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/login");
                    }}
                  >
                    Login
                  </Button>
                ) : null}
                <Button
                  className="w-full"
                  onClick={() => {
                    setMenuOpen(false);
                    handleGetStarted();
                  }}
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        <section
          id="home"
          className="container grid gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24"
        >
          <div className="space-y-8">
            <Badge className="w-fit gap-2 px-3 py-1.5 text-sm" variant="default">
              <Sparkles className="h-4 w-4" />
              Premium workflow for corporate travel
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Manage every business mission with clarity, speed, and
                executive-level control.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                Mission Flow centralizes mission requests, approvals, travel
                planning, and expense oversight in one elegant SaaS workspace
                built for modern organizations.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={handleGetStarted}>
                {isAuthenticated ? "Open Dashboard" : "Get Started"}
                <ArrowRight className="h-4 w-4" />
              </Button>
              {!isAuthenticated ? (
                <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                  Login
                </Button>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <Card key={metric.label} className="border-primary/10 bg-card/80">
                  <CardContent className="p-5">
                    <p className="text-2xl font-semibold">{metric.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden border-primary/10 bg-card/85 shadow-glow">
            <CardContent className="space-y-6 p-0">
              <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
                <div>
                  <p className="text-sm text-muted-foreground">Operations snapshot</p>
                  <h2 className="text-xl font-semibold">Mission command center</h2>
                </div>
                <Badge variant="success">98.6% SLA</Badge>
              </div>
              <div className="grid gap-4 px-6 lg:grid-cols-2">
                <MetricSurface label="Pending approvals" value="18" helper="6 submitted today" />
                <MetricSurface label="Upcoming departures" value="9" helper="Next trip in 14h" />
                <MetricSurface label="Travel budget used" value="72%" helper="Within monthly threshold" />
                <MetricSurface label="Policy compliance" value="96%" helper="Auto-check enabled" />
              </div>
              <div className="px-6 pb-6">
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Current trip</p>
                      <p className="text-base font-semibold">
                        Client onboarding visit - Berlin
                      </p>
                    </div>
                    <Badge>In Progress</Badge>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <InfoPair label="Traveler" value="Khaled Ben Salah" />
                    <InfoPair label="Budget" value="$3,420" />
                    <InfoPair label="Manager" value="Nadia Trabelsi" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="missions" className="container py-8 lg:py-14">
          <SectionHeading
            eyebrow="Features"
            title="A modern mission management platform built around speed and structure."
            description="Every screen is organized for clarity, giving employees, managers, and admins the exact level of control they need."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Mission requests",
                description:
                  "Launch new travel requests with dates, purpose, budgets, transport, and supporting files.",
                icon: FileText,
              },
              {
                title: "Approval workflow",
                description:
                  "Managers review pending requests, add comments, and approve or reject in one focused flow.",
                icon: ShieldCheck,
              },
              {
                title: "Expense visibility",
                description:
                  "Track estimated budgets, reimbursement status, and policy alignment before and after travel.",
                icon: WalletCards,
              },
              {
                title: "Export and archive",
                description:
                  "Admins manage data retention, system analytics, user roles, and reporting with confidence.",
                icon: Download,
              },
            ].map((feature) => (
              <SpotlightCard key={feature.title}>
                <CardHeader className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </CardHeader>
              </SpotlightCard>
            ))}
          </div>
        </section>

        <section className="container py-8 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="bg-gradient-to-br from-primary/10 via-card to-card">
              <CardHeader>
                <Badge variant="muted" className="w-fit">
                  How it works
                </Badge>
                <CardTitle className="text-3xl">
                  A polished flow from request to reimbursement.
                </CardTitle>
                <CardDescription>
                  Mission Flow keeps the full lifecycle visible, so nobody loses
                  context between submission, validation, and reporting.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Employee submits a mission with dates, destination, purpose, and budget.",
                  "Manager receives a clear approval queue with comments, files, and traveler context.",
                  "Admin monitors activity, exports reports, and keeps the organization compliant.",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-2xl border border-border/60 bg-background/60 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-7 text-muted-foreground">{step}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="grid gap-5 sm:grid-cols-2">
              {benefitCards.map((benefit) => (
                <Card key={benefit.title} className="sm:last:col-span-2">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-foreground">
                      <benefit.icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="container py-8 lg:py-14">
          <div className="grid gap-5 rounded-[2rem] border border-border/70 bg-card/85 p-8 lg:grid-cols-4">
            {[
              { label: "Organizations", value: "120+" },
              { label: "Missions tracked", value: "18,600" },
              { label: "Approval success", value: "94%" },
              { label: "Travel spend tracked", value: "$8.4M" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-semibold">{stat.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="container py-8 lg:py-16">
          <SectionHeading
            eyebrow="About Mission Flow"
            title="Built to feel trustworthy, organized, and genuinely effortless to use."
            description="The UI pairs soft surfaces, strong hierarchy, and responsive dashboard patterns so teams can move quickly without losing precision."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Trustworthy design</CardTitle>
                <CardDescription>
                  Readable contrast, structured forms, and status clarity for
                  every mission stage.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Enterprise-ready layout</CardTitle>
                <CardDescription>
                  Collapsible sidebars, analytics panels, and full role-based
                  control centers.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Responsive everywhere</CardTitle>
                <CardDescription>
                  Landing, auth, dashboards, and forms adapt smoothly across
                  mobile, tablet, and desktop.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-card/60">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold">Mission Flow</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Premium mission planning, travel validation, and expense oversight.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <span>Home</span>
            <span>Missions</span>
            <span>About Us</span>
            {!isAuthenticated ? <span>Login / Register</span> : null}
          </div>
        </div>
      </footer>
    </div>
  );
}
