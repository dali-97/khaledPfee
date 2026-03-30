import {
  ArrowRight,
  Download,
  FileText,
  Plane,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { benefitCards } from "@/data/mission-flow";
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
import type { AppScreen, Theme } from "@/types/app";

export function LandingPage({
  theme,
  onThemeToggle,
  onNavigate,
  onGetStarted,
  onLogin,
  metrics,
}: {
  theme: Theme;
  onThemeToggle: () => void;
  onNavigate: (screen: AppScreen) => void;
  onGetStarted: () => void;
  onLogin: () => void;
  metrics: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="relative">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
              <Plane className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold">Mission Flow</p>
              <p className="text-sm text-muted-foreground">Corporate mission operations</p>
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
            <button onClick={onLogin} className="transition hover:text-foreground">
              Login
            </button>
            <button
              onClick={() => onNavigate("register")}
              className="transition hover:text-foreground"
            >
              Register
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggleButton theme={theme} onClick={onThemeToggle} />
            <Button variant="outline" className="hidden md:inline-flex" onClick={onLogin}>
              Login
            </Button>
            <Button onClick={onGetStarted}>Get Started</Button>
          </div>
        </div>
        <div className="container flex gap-2 overflow-x-auto pb-4 md:hidden">
          {["Home", "Missions", "About Us"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-border/70 bg-card px-3 py-1.5 text-sm text-muted-foreground"
            >
              {item}
            </span>
          ))}
          <button
            onClick={onLogin}
            className="rounded-full border border-border/70 bg-card px-3 py-1.5 text-sm text-muted-foreground"
          >
            Login
          </button>
        </div>
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
                Manage every business mission with clarity, speed, and executive-level
                control.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                Mission Flow centralizes mission requests, approvals, travel planning, and
                expense oversight in one elegant SaaS workspace built for modern
                organizations.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={onGetStarted}>
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={onLogin}>
                Login
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
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
                      <p className="text-base font-semibold">Client onboarding visit - Berlin</p>
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
              <Card key={feature.title} className="group">
                <CardHeader className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
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
                  Mission Flow keeps the full lifecycle visible, so nobody loses context
                  between submission, validation, and reporting.
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
                  Readable contrast, structured forms, and status clarity for every mission stage.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Enterprise-ready layout</CardTitle>
                <CardDescription>
                  Collapsible sidebars, analytics panels, and full role-based control centers.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Responsive everywhere</CardTitle>
                <CardDescription>
                  Landing, auth, dashboards, and forms adapt smoothly across mobile, tablet, and desktop.
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
            <span>Login / Register</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
