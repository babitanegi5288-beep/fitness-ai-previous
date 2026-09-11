import { useEffect, useState } from "react";
import "./App.css";
import SportsPlayer3D from "./SportsPlayer3D";
/* =========================================================
   CONSTANTS
========================================================= */

const SPORTS = ["Football", "Cricket", "Basketball", "Tennis"];

const GOALS = [
  "Improve Fitness",
  "Improve Performance",
  "Learn Sports Skills",
  "Stay Active",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

/* =========================================================
   APP
========================================================= */

function App() {
  const [page, setPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [authMode, setAuthMode] = useState("login");

  const [profile, setProfile] = useState({
    id: null,
    name: "",
    email: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    level: "Beginner",
    sport: "Football",
    goal: "Improve Fitness",
  });

  /* =======================================================
     LOGIN
  ======================================================= */

  async function handleLogin(email, password) {
    try {
      const response = await fetch(
        "http://https://fitness-ai-8lc3.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Login failed");
        return;
      }

      setProfile({
        id: data.user.id,
        name: data.user.name || "",
        email: data.user.email || "",
        gender: data.user.gender || "",
        age: data.user.age || "",
        height: data.user.height || "",
        weight: data.user.weight || "",
        level: data.user.experience_level || "Beginner",
        sport: data.user.sport || "Football",
        goal: data.user.goal || "Improve Fitness",
      });

      setIsLoggedIn(true);
      setPage("dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Cannot connect to FITNESS-AI backend.");
    }
  }

  /* =======================================================
     SIGN UP
  ======================================================= */

  async function handleSignup(data) {
    try {
      const response = await fetch(
        "http://https://fitness-ai-8lc3.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            gender: data.gender || null,
            age: data.age ? Number(data.age) : null,
            height: data.height ? Number(data.height) : null,
            weight: data.weight ? Number(data.weight) : null,
            sport: data.sport,
            goal: data.goal,
            experience_level: data.experience_level,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = Array.isArray(result.detail)
          ? result.detail
              .map((error) => {
                const field =
                  error.loc?.[error.loc.length - 1] || "field";

                return `${field}: ${error.msg}`;
              })
              .join("\n")
          : String(result.detail || "Signup failed");

        alert(errorMessage);
        return;
      }

      setProfile({
        id: result.user.id,
        name: data.name,
        email: data.email,
        gender: data.gender || "",
        age: data.age || "",
        height: data.height || "",
        weight: data.weight || "",
        level: data.experience_level || "Beginner",
        sport: data.sport || "Football",
        goal: data.goal || "Improve Fitness",
      });

      setIsLoggedIn(true);
      setPage("dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Cannot connect to FITNESS-AI backend.");
    }
  }

  /* =======================================================
     LOGOUT
  ======================================================= */

  function handleLogout() {
    setIsLoggedIn(false);
    setPage("home");

    setProfile({
      id: null,
      name: "",
      email: "",
      gender: "",
      age: "",
      height: "",
      weight: "",
      level: "Beginner",
      sport: "Football",
      goal: "Improve Fitness",
    });
  }

  /* =======================================================
     PAGE ROUTING
  ======================================================= */

  if (!isLoggedIn) {
    if (page === "login") {
      return (
        <AuthPage
          mode="login"
          onBack={() => setPage("home")}
          onSwitch={() => {
            setAuthMode("signup");
            setPage("signup");
          }}
          onLogin={handleLogin}
        />
      );
    }

    if (page === "signup") {
      return (
        <AuthPage
          mode="signup"
          onBack={() => setPage("home")}
          onSwitch={() => {
            setAuthMode("login");
            setPage("login");
          }}
          onSignup={handleSignup}
        />
      );
    }

    return (
      <HomePage
        onLogin={() => {
          setAuthMode("login");
          setPage("login");
        }}
        onSignup={() => {
          setAuthMode("signup");
          setPage("signup");
        }}
      />
    );
  }

  return (
    <Dashboard
      page={page}
      setPage={setPage}
      profile={profile}
      setProfile={setProfile}
      onLogout={handleLogout}
    />
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

function HomePage({ onLogin, onSignup }) {
  return (
    <div className="app home-page">

      {/* TOP BAR */}

      <header className="topbar">

        <div className="logo">
  <img
    src="/fitness-ai-logo.png"
    alt="FITNESS-AI"
  />
</div>

        <div className="top-actions">
          <button className="btn secondary" onClick={onLogin}>
            Login
          </button>

          <button className="btn primary" onClick={onSignup}>
            Sign Up
          </button>
        </div>

      </header>

      <main>

        {/* HERO */}

        <section className="hero">

          {/* LEFT */}

          <div className="hero-content">

            <p className="eyebrow">
              AI POWERED SPORTS & FITNESS
            </p>

            <h1>
              Train Smarter.
              <br />
              <span>Play Better.</span>
            </h1>

            <p className="hero-text">
              Personalized training, nutrition guidance,
              sports learning, and AI-powered fitness support
              in one place.
            </p>

            <div className="hero-buttons">

              <button
                className="btn primary large"
                onClick={onSignup}
              >
                Start Your Journey
                <span className="arrow">→</span>
              </button>

              <button
                className="btn secondary large"
                onClick={onLogin}
              >
                Login
              </button>

            </div>

          </div>

          {/* RIGHT VISUAL */}

          <div className="hero-visual">

            <div className="visual-glow"></div>

            <div className="visual-ring ring-one"></div>

            <div className="visual-ring ring-two"></div>

            <div className="ai-core">
              <div className="ai-core-inner">
                <span>⚡</span>
                <strong>FITNESS</strong>
                <small>AI</small>
              </div>
            </div>

            <div className="visual-label training-label">
              <div className="label-icon">🏃</div>
              <span>Training</span>
            </div>

            <div className="visual-label nutrition-label">
              <div className="label-icon">🥗</div>
              <span>Nutrition</span>
            </div>

            <div className="visual-label learning-label">
              <div className="label-icon">🏆</div>
              <span>Sports Learning</span>
            </div>

            <div className="visual-label scanner-label">
              <div className="label-icon">📷</div>
              <span>Food Scanner</span>
            </div>

            <div className="visual-label coach-label">
              <div className="label-icon">🤖</div>
              <span>AI Coach</span>
            </div>

            <div className="sport-ball ball-one">
              ⚽
            </div>

            <div className="sport-ball ball-two">
              🏀
            </div>

            <div className="sport-ball ball-three">
              🎾
            </div>

          </div>

        </section>

        {/* FEATURES */}

        <section className="features-section">

          <div className="section-heading">
            <p className="eyebrow">ONE PLATFORM</p>

            <h2>
              Everything You Need
            </h2>

            <p>
              Train, learn, track and improve with FITNESS-AI.
            </p>
          </div>

          <div className="feature-grid">

            <FeatureCard
              icon="🏃"
              title="Training"
              text="Personalized exercises based on your sport and goal."
            />

            <FeatureCard
              icon="🥗"
              title="Nutrition"
              text="Simple and affordable meal guidance for your daily routine."
            />

            <FeatureCard
              icon="🏆"
              title="Sports Learning"
              text="Learn rules, positions, techniques and strategies."
            />

            <FeatureCard
              icon="📷"
              title="Food Scanner"
              text="Analyze food information and understand its nutrients."
            />

            <FeatureCard
              icon="🤖"
              title="AI Coach"
              text="Get AI-powered guidance and track your journey."
            />

            <FeatureCard
              icon="⚙️"
              title="Settings"
              text="Manage your profile and fitness preferences."
            />

          </div>

        </section>

      </main>

      <footer className="footer">
        <p>© 2026 FITNESS-AI • Train • Learn • Perform</p>
      </footer>

    </div>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({ icon, title, text }) {
  return (
    <div className="feature-card">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

    </div>
  );
}

/* =========================================================
   AUTH PAGE
========================================================= */

function AuthPage({
  mode,
  onBack,
  onSwitch,
  onLogin,
  onSignup,
}) {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    sport: "Football",
    goal: "Improve Fitness",
    experience_level: "Beginner",
  });

  const isSignup = mode === "signup";

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function submitLogin(event) {
    event.preventDefault();

    if (!form.email || !form.password) {
      alert("Please enter email and password.");
      return;
    }

    onLogin(form.email, form.password);
  }

  function nextStep(event) {
    event.preventDefault();

    if (step === 1) {
      if (!form.name || !form.email || !form.password) {
        alert("Please fill all required fields.");
        return;
      }

      if (form.password.length < 8) {
        alert("Password must contain at least 8 characters.");
        return;
      }
    }

    if (step === 2) {
      if (!form.age || !form.gender) {
        alert("Please enter your age and select gender.");
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 3));
  }

  function submitSignup(event) {
    event.preventDefault();

    if (!form.sport || !form.goal || !form.experience_level) {
      alert("Please select your sport, goal and experience level.");
      return;
    }

    onSignup(form);
  }

  return (
    <div className="auth-page">

      <div className="auth-background-glow"></div>

      <div className="auth-card">

        <button className="back-button" onClick={onBack}>
          ← Back
        </button>

        <div className="auth-logo">
          ⚡ FITNESS-AI
        </div>

        {!isSignup ? (
          <>
            <div className="auth-heading">
              <p className="eyebrow">WELCOME BACK</p>
              <h1>Login</h1>
              <p>Continue your fitness journey.</p>
            </div>

            <form onSubmit={submitLogin}>

              <label>Email</label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  updateField("email", e.target.value)
                }
                placeholder="Enter your email"
              />

              <label>Password</label>

              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  updateField("password", e.target.value)
                }
                placeholder="Enter your password"
              />

              <button className="btn primary auth-submit">
                Login
              </button>

            </form>

            <p className="auth-switch">
              Don't have an account?{" "}
              <button onClick={onSwitch}>
                Sign Up
              </button>
            </p>
          </>
        ) : (
          <>
            <div className="auth-heading">
              <p className="eyebrow">
                STEP {step} OF 3
              </p>

              <h1>
                {step === 1 && "Create Account"}
                {step === 2 && "About You"}
                {step === 3 && "Your Fitness"}
              </h1>

              <p>
                {step === 1 &&
                  "Create your FITNESS-AI account."}

                {step === 2 &&
                  "Help us understand your profile."}

                {step === 3 &&
                  "Choose your sport and fitness goal."}
              </p>
            </div>

            <form
              onSubmit={
                step === 3
                  ? submitSignup
                  : nextStep
              }
            >

              {/* STEP 1 */}

              {step === 1 && (
                <>
                  <label>Name</label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                    placeholder="Your name"
                  />

                  <label>Email</label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      updateField("email", e.target.value)
                    }
                    placeholder="Your email"
                  />

                  <label>Password</label>

                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      updateField(
                        "password",
                        e.target.value
                      )
                    }
                    placeholder="Minimum 8 characters"
                  />
                </>
              )}

              {/* STEP 2 */}

              {step === 2 && (
                <>
                  <label>Gender</label>

                  <select
                    value={form.gender}
                    onChange={(e) =>
                      updateField(
                        "gender",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select gender
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Other">
                      Other
                    </option>

                    <option value="Prefer not to say">
                      Prefer not to say
                    </option>
                  </select>

                  <label>Age</label>

                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={form.age}
                    onChange={(e) =>
                      updateField(
                        "age",
                        e.target.value
                      )
                    }
                    placeholder="Age"
                  />

                  <label>Height (cm)</label>

                  <input
                    type="number"
                    value={form.height}
                    onChange={(e) =>
                      updateField(
                        "height",
                        e.target.value
                      )
                    }
                    placeholder="Height"
                  />

                  <label>Weight (kg)</label>

                  <input
                    type="number"
                    value={form.weight}
                    onChange={(e) =>
                      updateField(
                        "weight",
                        e.target.value
                      )
                    }
                    placeholder="Weight"
                  />
                </>
              )}

              {/* STEP 3 */}

              {step === 3 && (
                <>
                  <label>Experience Level</label>

                  <div className="choice-grid">

                    {LEVELS.map((level) => (
                      <button
                        type="button"
                        key={level}
                        className={
                          form.experience_level === level
                            ? "choice active"
                            : "choice"
                        }
                        onClick={() =>
                          updateField(
                            "experience_level",
                            level
                          )
                        }
                      >
                        {level}
                      </button>
                    ))}

                  </div>

                  <label>Sport</label>

                  <div className="choice-grid">

                    {SPORTS.map((sport) => (
                      <button
                        type="button"
                        key={sport}
                        className={
                          form.sport === sport
                            ? "choice active"
                            : "choice"
                        }
                        onClick={() =>
                          updateField(
                            "sport",
                            sport
                          )
                        }
                      >
                        {sport}
                      </button>
                    ))}

                  </div>

                  <label>Goal</label>

                  <div className="choice-grid">

                    {GOALS.map((goal) => (
                      <button
                        type="button"
                        key={goal}
                        className={
                          form.goal === goal
                            ? "choice active"
                            : "choice"
                        }
                        onClick={() =>
                          updateField(
                            "goal",
                            goal
                          )
                        }
                      >
                        {goal}
                      </button>
                    ))}

                  </div>
                </>
              )}

              <div className="auth-navigation">

                {step > 1 && (
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() =>
                      setStep((prev) => prev - 1)
                    }
                  >
                    Back
                  </button>
                )}

                <button className="btn primary">
                  {step === 3
                    ? "Create Account"
                    : "Continue →"}
                </button>

              </div>

            </form>

            <p className="auth-switch">
              Already have an account?{" "}
              <button onClick={onSwitch}>
                Login
              </button>
            </p>
          </>
        )}

      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  page,
  setPage,
  profile,
  setProfile,
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menu = [
    {
      id: "dashboard",
      icon: "⌂",
      label: "Dashboard",
    },
    {
      id: "training",
      icon: "🏃",
      label: "Training",
    },
    {
      id: "nutrition",
      icon: "🥗",
      label: "Nutrition",
    },
    {
      id: "sports",
      icon: "🏆",
      label: "Sports Learning",
    },
    {
      id: "scanner",
      icon: "📷",
      label: "Food Scanner",
    },
    {
      id: "coach",
      icon: "🤖",
      label: "AI Coach",
    },
    {
      id: "settings",
      icon: "⚙️",
      label: "Settings",
    },
  ];

  function navigate(id) {
    setPage(id);
    setSidebarOpen(false);
  }

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}

      <aside
        className={
          sidebarOpen
            ? "sidebar mobile-open"
            : "sidebar"
        }
      >

        <div className="sidebar-logo">
          ⚡ FITNESS-AI
        </div>

        <div className="user-mini-card">

          <div className="avatar">
            {profile.name
              ? profile.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div>
            <strong>
              {profile.name || "User"}
            </strong>

            <span>
              {profile.sport}
            </span>
          </div>

        </div>

        <nav className="sidebar-nav">

          {menu.map((item) => (
            <button
              key={item.id}
              className={
                page === item.id
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                navigate(item.id)
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}

        </nav>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          ↪ Logout
        </button>

      </aside>

      {/* MAIN */}

      <main className="dashboard-main">

        <header className="dashboard-header">

          <button
            className="mobile-menu-button"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          >
            ☰
          </button>

          <div>
            <p className="eyebrow">
              FITNESS-AI
            </p>

            <h1>
              {getPageTitle(page)}
            </h1>
          </div>

          <div className="header-profile">
            <span>
              Hi, {profile.name || "User"} 👋
            </span>
          </div>

        </header>

        <div className="dashboard-content">

          {page === "dashboard" && (
            <DashboardHome
              profile={profile}
              setPage={setPage}
            />
          )}

          {page === "training" && (
            <TrainingPage
              profile={profile}
            />
          )}

          {page === "nutrition" && (
            <NutritionPage
              profile={profile}
            />
          )}

          {page === "sports" && (
            <SportsLearningPage
              profile={profile}
            />
          )}

          {page === "scanner" && (
            <FoodScannerPage
              profile={profile}
            />
          )}

          {page === "coach" && (
            <AICoachPage
              profile={profile}
            />
          )}

          {page === "settings" && (
            <SettingsPage
              profile={profile}
              setProfile={setProfile}
            />
          )}

        </div>

      </main>

    </div>
  );
}

function getPageTitle(page) {
  const titles = {
    dashboard: "Your Dashboard",
    training: "Training",
    nutrition: "Nutrition",
    sports: "Sports Learning",
    scanner: "Food Scanner",
    coach: "AI Coach",
    settings: "Settings",
  };

  return titles[page] || "Dashboard";
}

/* =========================================================
   DASHBOARD HOME
========================================================= */

function DashboardHome({ profile, setPage }) {
  return (
    <div>

      <div className="welcome-banner">

        <div>

          <p className="eyebrow">
            YOUR FITNESS JOURNEY
          </p>

          <h2>
            Welcome, {profile.name || "Athlete"}!
          </h2>

          <p>
            Your plan is built around{" "}
            <strong>{profile.sport}</strong>{" "}
            and your goal of{" "}
            <strong>{profile.goal}</strong>.
          </p>

        </div>

        <div className="welcome-icon">
          ⚡
        </div>

      </div>

      <div className="dashboard-stats">

        <StatCard
          icon="🏃"
          title="Sport"
          value={profile.sport}
        />

        <StatCard
          icon="🎯"
          title="Goal"
          value={profile.goal}
        />

        <StatCard
          icon="📈"
          title="Level"
          value={profile.level}
        />

        <StatCard
          icon="🔥"
          title="Journey"
          value="Active"
        />

      </div>

      <div className="quick-section">

        <div className="section-heading left">

          <p className="eyebrow">
            QUICK ACCESS
          </p>

          <h2>
            Continue Your Journey
          </h2>

        </div>

        <div className="quick-grid">

          <QuickAction
            icon="🏃"
            title="Start Training"
            text="Begin your personalized session."
            onClick={() =>
              setPage("training")
            }
          />

          <QuickAction
            icon="🥗"
            title="Check Nutrition"
            text="View today's simple meal plan."
            onClick={() =>
              setPage("nutrition")
            }
          />

          <QuickAction
            icon="🏆"
            title="Learn Your Sport"
            text="Explore rules and techniques."
            onClick={() =>
              setPage("sports")
            }
          />

          <QuickAction
            icon="🤖"
            title="Ask AI Coach"
            text="Get fitness guidance."
            onClick={() =>
              setPage("coach")
            }
          />

        </div>

      </div>

    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}

function QuickAction({
  icon,
  title,
  text,
  onClick,
}) {
  return (
    <button
      className="quick-action"
      onClick={onClick}
    >
      <span className="quick-icon">
        {icon}
      </span>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>

      <span className="quick-arrow">
        →
      </span>
    </button>
  );
}

/* =========================================================
   TRAINING
========================================================= */

function TrainingPage({ profile }) {
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ---------------------------------------------------------
     USER + DATE
  --------------------------------------------------------- */

  const today = new Date().toISOString().split("T")[0];

  const userKey =
    profile?.id ||
    profile?.user_id ||
    profile?.email ||
    "guest";

  const storageKey = `fitai-training-${userKey}-${today}`;

  /* ---------------------------------------------------------
     LOAD EXERCISES
  --------------------------------------------------------- */

  useEffect(() => {
    loadExercises();
  }, [profile?.sport, profile?.goal]);

  async function loadExercises() {
    setLoading(true);

    try {
      const response = await fetch(
        `http://https://fitness-ai-8lc3.onrender.com/api/training/exercises?sport=${encodeURIComponent(
          profile.sport
        )}&goal=${encodeURIComponent(profile.goal)}`
      );

      if (response.ok) {
        const data = await response.json();

        const backendExercises = data.exercises || [];

        if (backendExercises.length > 0) {
          setExercises(backendExercises);

          /* Restore today's progress */
          const savedData = localStorage.getItem(storageKey);

          if (savedData) {
            const saved = JSON.parse(savedData);

            setCompleted(saved.completed || []);
            setCurrentIndex(
              saved.currentIndex || 0
            );

            const savedIndex =
              saved.currentIndex || 0;

            setTimeLeft(
              saved.timeLeft ??
                backendExercises[savedIndex]
                  ?.duration_seconds ??
                30
            );
          } else {
            setCompleted([]);
            setCurrentIndex(0);
            setTimeLeft(
              backendExercises[0]
                ?.duration_seconds || 30
            );
          }

          setIsRunning(false);
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log(
        "Training backend unavailable:",
        error
      );
    }

    /* -------------------------------------------------------
       FALLBACK
    ------------------------------------------------------- */

    const fallback = getFallbackExercises(
      profile.sport,
      profile.goal
    );

    setExercises(fallback);

    const savedData = localStorage.getItem(
      storageKey
    );

    if (savedData) {
      const saved = JSON.parse(savedData);

      setCompleted(saved.completed || []);
      setCurrentIndex(
        saved.currentIndex || 0
      );

      const savedIndex =
        saved.currentIndex || 0;

      setTimeLeft(
        saved.timeLeft ??
          fallback[savedIndex]?.duration_seconds ??
          30
      );
    } else {
      setCompleted([]);
      setCurrentIndex(0);
      setTimeLeft(
        fallback[0]?.duration_seconds || 30
      );
    }

    setIsRunning(false);
    setLoading(false);
  }

  /* ---------------------------------------------------------
     SAVE CURRENT TRAINING STATE
  --------------------------------------------------------- */

  useEffect(() => {
    if (exercises.length === 0) return;

    const trainingState = {
      completed,
      currentIndex,
      timeLeft,
      date: today,
    };

    localStorage.setItem(
      storageKey,
      JSON.stringify(trainingState)
    );
  }, [
    completed,
    currentIndex,
    timeLeft,
    exercises.length,
    storageKey,
    today,
  ]);

  /* ---------------------------------------------------------
     TIMER
  --------------------------------------------------------- */

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);

          completeCurrentExercise();

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, currentIndex]);

  /* ---------------------------------------------------------
     START
  --------------------------------------------------------- */

  function startExercise() {
    if (!exercises[currentIndex]) return;

    if (completed.includes(exercises[currentIndex].id)) {
      return;
    }

    if (timeLeft <= 0) {
      setTimeLeft(
        exercises[currentIndex]
          .duration_seconds || 30
      );
    }

    setIsRunning(true);
  }

  /* ---------------------------------------------------------
     PAUSE
  --------------------------------------------------------- */

  function pauseExercise() {
    setIsRunning(false);
  }

  /* ---------------------------------------------------------
     STOP
  --------------------------------------------------------- */

  function stopExercise() {
    setIsRunning(false);

    const current = exercises[currentIndex];

    if (!current) return;

    setTimeLeft(
      current.duration_seconds || 30
    );
  }

  /* ---------------------------------------------------------
     COMPLETE
  --------------------------------------------------------- */

  function completeCurrentExercise() {
    if (exercises.length === 0) return;

    const current = exercises[currentIndex];

    if (!current) return;

    setIsRunning(false);

    setCompleted((prev) => {
      if (prev.includes(current.id)) {
        return prev;
      }

      return [...prev, current.id];
    });
  }

  /* ---------------------------------------------------------
     NEXT EXERCISE
  --------------------------------------------------------- */

  function nextExercise() {
    if (currentIndex >= exercises.length - 1) {
      return;
    }

    const nextIndex = currentIndex + 1;

    setCurrentIndex(nextIndex);

    setTimeLeft(
      exercises[nextIndex]
        ?.duration_seconds || 30
    );

    setIsRunning(false);
  }

  /* ---------------------------------------------------------
     SELECT EXERCISE FROM LEFT LIST
  --------------------------------------------------------- */

  function selectExercise(index) {
    setIsRunning(false);

    setCurrentIndex(index);

    const selected = exercises[index];

    if (!selected) return;

    if (completed.includes(selected.id)) {
      setTimeLeft(0);
    } else {
      setTimeLeft(
        selected.duration_seconds || 30
      );
    }
  }

  /* ---------------------------------------------------------
     LOADING
  --------------------------------------------------------- */

  if (loading) {
    return (
      <div className="loading-card">
        Loading your training session...
      </div>
    );
  }

  const current = exercises[currentIndex];

  const progress =
    exercises.length > 0
      ? Math.round(
          (completed.length /
            exercises.length) *
            100
        )
      : 0;

  const currentCompleted =
    current &&
    completed.includes(current.id);

  return (
    <div className="training-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="page-intro">

        <p className="eyebrow">
          PERSONALIZED DAILY SESSION
        </p>

        <h2>
          {profile.sport} Training
        </h2>

        <p>
          Training plan for{" "}
          <strong>{profile.goal}</strong>
        </p>

      </div>

      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <div className="progress-card">

        <div className="progress-header">
          <span>Today's Progress</span>

          <strong>
            {progress}%
          </strong>
        </div>

        <div className="progress-bar">

          <div
            style={{
              width: `${progress}%`,
            }}
          ></div>

        </div>

        <p>
          {completed.length} of{" "}
          {exercises.length} exercises completed
        </p>

      </div>

      {/* =====================================================
          MAIN TRAINING AREA
      ===================================================== */}

      <div className="training-layout">

        {/* ===================================================
            LEFT — EXERCISE LIST
        =================================================== */}

        <div className="exercise-list-card">

          <div className="exercise-list-header">

            <h3>
              Today's Exercises
            </h3>

            <span>
              {exercises.length}
            </span>

          </div>

          <div className="exercise-list">

            {exercises.map(
              (exercise, index) => {

                const isCompleted =
                  completed.includes(
                    exercise.id
                  );

                const isSelected =
                  index === currentIndex;

                return (
                  <button
                    key={exercise.id}
                    className={`exercise-list-item ${
                      isSelected
                        ? "selected"
                        : ""
                    } ${
                      isCompleted
                        ? "completed"
                        : ""
                    }`}
                    onClick={() =>
                      selectExercise(index)
                    }
                  >

                    <div className="exercise-list-number">

                      {isCompleted
                        ? "✓"
                        : index + 1}

                    </div>

                    <div className="exercise-list-info">

                      <strong>
                        {exercise.name}
                      </strong>

                      <span>
                        {exercise.duration_seconds}s
                      </span>

                    </div>

                  </button>
                );
              }
            )}

          </div>

        </div>

        {/* ===================================================
            RIGHT — CURRENT EXERCISE
        =================================================== */}

        <div className="training-card">

          {current && (
            <>

              <div className="training-number">

                Exercise {currentIndex + 1} /{" "}
                {exercises.length}

              </div>

              <div className="training-title-row">

                <div>

                  <h2>
                    {current.name}
                  </h2>

                  {currentCompleted && (
                    <span className="done-badge">
                      ✓ Done
                    </span>
                  )}

                </div>

              </div>

              {/* =============================================
                  HOW TO DO
              ============================================= */}

              <div className="how-to-card">

                <h3>
                  How to do
                </h3>

                <ol>

                  {current.how_to_do?.map(
                    (step, index) => (
                      <li key={index}>
                        {step}
                      </li>
                    )
                  )}

                </ol>

              </div>

              {/* =============================================
                  TIMER
              ============================================= */}

              <div className="timer-section">

                <p>
                  {currentCompleted
                    ? "Exercise completed"
                    : isRunning
                    ? "Exercise in progress"
                    : "Ready to start"}
                </p>

                <div className="training-timer">

                  {formatTime(timeLeft)}

                </div>

              </div>

              {/* =============================================
                  BUTTONS
              ============================================= */}

              <div className="training-actions">

                {!currentCompleted && (
                  <>
                    {!isRunning ? (
                      <button
                        className="btn primary large"
                        onClick={
                          startExercise
                        }
                      >
                        ▶ Start
                      </button>
                    ) : (
                      <button
                        className="btn primary large"
                        onClick={
                          pauseExercise
                        }
                      >
                        ⏸ Pause
                      </button>
                    )}

                    <button
                      className="btn secondary large"
                      onClick={stopExercise}
                    >
                      ⏹ Stop
                    </button>

                  </>
                )}

                {currentCompleted &&
                  currentIndex <
                    exercises.length - 1 && (
                    <button
                      className="btn primary large"
                      onClick={nextExercise}
                    >
                      Next Exercise →
                    </button>
                  )}

              </div>

              {/* =============================================
                  FINISHED MESSAGE
              ============================================= */}

              {currentCompleted && (
                <div className="exercise-done-message">

                  <strong>
                    ✓ Done
                  </strong>

                  <span>
                    Great! This exercise is
                    completed.
                  </span>

                </div>
              )}

            </>
          )}

        </div>

      </div>

      {/* =====================================================
          SESSION COMPLETE
      ===================================================== */}

      {progress === 100 && (
        <div className="success-card">

          🎉 Today's training session
          completed!

        </div>
      )}

    </div>
  );
}


/* =========================================================
   FORMAT TIMER
========================================================= */

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
}


/* =========================================================
   FALLBACK EXERCISES
========================================================= */

function getFallbackExercises(
  sport,
  goal
) {
  const plans = {

    Football: {
      "Improve Fitness": [
        {
          id: "football-warmup",
          name: "Dynamic Warm-Up",
          how_to_do: [
            "Start with light jogging.",
            "Move your arms naturally while jogging.",
            "Gradually increase your movement.",
            "Keep your body controlled.",
          ],
          duration_seconds: 30,
        },
        {
          id: "football-high-knees",
          name: "High Knees",
          how_to_do: [
            "Stand upright with your feet shoulder-width apart.",
            "Lift one knee toward your waist.",
            "Lower it and lift the opposite knee.",
            "Continue at a controlled pace.",
          ],
          duration_seconds: 40,
        },
        {
          id: "football-shuttle",
          name: "Shuttle Run",
          how_to_do: [
            "Mark two safe points a short distance apart.",
            "Run from one point to the other.",
            "Slow down before changing direction.",
            "Repeat while maintaining control.",
          ],
          duration_seconds: 45,
        },
        {
          id: "football-control",
          name: "Ball Control",
          how_to_do: [
            "Keep the football close to your feet.",
            "Use gentle touches with both feet.",
            "Keep your body balanced.",
            "Practice controlling the ball while moving.",
          ],
          duration_seconds: 40,
        },
      ],

      "Build Strength": [
        {
          id: "football-squat",
          name: "Bodyweight Squats",
          how_to_do: [
            "Stand with your feet about shoulder-width apart.",
            "Bend your knees and hips.",
            "Keep your chest controlled and upright.",
            "Return to the standing position.",
          ],
          duration_seconds: 40,
        },
        {
          id: "football-lunge",
          name: "Forward Lunges",
          how_to_do: [
            "Stand upright.",
            "Step one foot forward.",
            "Lower your body with control.",
            "Return to the starting position.",
          ],
          duration_seconds: 40,
        },
        {
          id: "football-plank",
          name: "Plank",
          how_to_do: [
            "Place your hands or forearms on a stable surface.",
            "Keep your body in a straight line.",
            "Keep your core controlled.",
            "Hold the position comfortably.",
          ],
          duration_seconds: 30,
        },
      ],

      "Improve Speed": [
        {
          id: "football-fast-feet",
          name: "Fast Feet",
          how_to_do: [
            "Stand in a balanced position.",
            "Move your feet quickly in place.",
            "Keep your upper body controlled.",
            "Maintain a steady rhythm.",
          ],
          duration_seconds: 30,
        },
        {
          id: "football-shuttle-speed",
          name: "Speed Shuttle",
          how_to_do: [
            "Mark two safe points.",
            "Accelerate toward the second point.",
            "Slow down before turning.",
            "Return under control.",
          ],
          duration_seconds: 40,
        },
        {
          id: "football-reaction",
          name: "Reaction Drill",
          how_to_do: [
            "Start in a ready position.",
            "Choose a safe movement direction.",
            "Move quickly when you receive a signal.",
            "Return to the ready position.",
          ],
          duration_seconds: 35,
        },
      ],
    },

    Cricket: {
      "Improve Fitness": [
        {
          id: "cricket-warmup",
          name: "Dynamic Warm-Up",
          how_to_do: [
            "Start with light jogging.",
            "Move your arms naturally.",
            "Gradually increase movement.",
            "Stay controlled.",
          ],
          duration_seconds: 30,
        },
        {
          id: "cricket-high-knees",
          name: "High Knees",
          how_to_do: [
            "Stand upright.",
            "Lift one knee at a time.",
            "Keep your posture controlled.",
            "Continue at a comfortable pace.",
          ],
          duration_seconds: 40,
        },
        {
          id: "cricket-footwork",
          name: "Batting Footwork",
          how_to_do: [
            "Start in a balanced batting stance.",
            "Move one foot forward.",
            "Return to your starting position.",
            "Practice both sides.",
          ],
          duration_seconds: 40,
        },
      ],

      "Build Strength": [
        {
          id: "cricket-squat",
          name: "Bodyweight Squats",
          how_to_do: [
            "Stand comfortably.",
            "Bend your knees and hips.",
            "Keep your posture controlled.",
            "Return to standing.",
          ],
          duration_seconds: 40,
        },
        {
          id: "cricket-lunge",
          name: "Forward Lunges",
          how_to_do: [
            "Stand upright.",
            "Step forward.",
            "Lower with control.",
            "Return to the starting position.",
          ],
          duration_seconds: 40,
        },
        {
          id: "cricket-core",
          name: "Core Hold",
          how_to_do: [
            "Choose a stable comfortable position.",
            "Keep your core gently engaged.",
            "Maintain controlled breathing.",
            "Stop if you feel pain.",
          ],
          duration_seconds: 30,
        },
      ],

      "Improve Speed": [
        {
          id: "cricket-fast-feet",
          name: "Fast Feet",
          how_to_do: [
            "Start in a balanced position.",
            "Move your feet quickly.",
            "Keep your upper body controlled.",
            "Maintain your rhythm.",
          ],
          duration_seconds: 30,
        },
        {
          id: "cricket-running",
          name: "Running Drill",
          how_to_do: [
            "Choose a safe running area.",
            "Start at an easy pace.",
            "Increase your pace gradually.",
            "Slow down before stopping.",
          ],
          duration_seconds: 40,
        },
      ],
    },

    Basketball: {
      "Improve Fitness": [
        {
          id: "basketball-warmup",
          name: "Dynamic Warm-Up",
          how_to_do: [
            "Start with light movement.",
            "Move your arms naturally.",
            "Gradually increase your pace.",
            "Stay balanced.",
          ],
          duration_seconds: 30,
        },
        {
          id: "basketball-dribble",
          name: "Dribbling",
          how_to_do: [
            "Keep the ball close to your body.",
            "Use controlled touches.",
            "Keep your knees slightly bent.",
            "Practice changing hands.",
          ],
          duration_seconds: 40,
        },
        {
          id: "basketball-shuffle",
          name: "Defensive Shuffle",
          how_to_do: [
            "Start in a balanced defensive stance.",
            "Move sideways.",
            "Keep your feet controlled.",
            "Avoid crossing your feet.",
          ],
          duration_seconds: 40,
        },
      ],

      "Build Strength": [
        {
          id: "basketball-squat",
          name: "Bodyweight Squats",
          how_to_do: [
            "Stand with a comfortable stance.",
            "Bend your knees and hips.",
            "Keep your chest controlled.",
            "Return to standing.",
          ],
          duration_seconds: 40,
        },
        {
          id: "basketball-lunge",
          name: "Lunges",
          how_to_do: [
            "Stand upright.",
            "Step forward.",
            "Lower with control.",
            "Return to standing.",
          ],
          duration_seconds: 40,
        },
      ],

      "Improve Speed": [
        {
          id: "basketball-fast-feet",
          name: "Fast Feet",
          how_to_do: [
            "Start in a ready position.",
            "Move your feet quickly.",
            "Keep your balance.",
            "Maintain a steady rhythm.",
          ],
          duration_seconds: 30,
        },
        {
          id: "basketball-shuffle",
          name: "Lateral Shuffle",
          how_to_do: [
            "Start in a basketball stance.",
            "Move sideways quickly.",
            "Keep your knees comfortably bent.",
            "Return to the starting position.",
          ],
          duration_seconds: 40,
        },
      ],
    },

    Tennis: {
      "Improve Fitness": [
        {
          id: "tennis-warmup",
          name: "Dynamic Warm-Up",
          how_to_do: [
            "Start with light movement.",
            "Move your arms naturally.",
            "Gradually increase your pace.",
            "Stay controlled.",
          ],
          duration_seconds: 30,
        },
        {
          id: "tennis-footwork",
          name: "Court Footwork",
          how_to_do: [
            "Start in the ready position.",
            "Move sideways.",
            "Keep your balance.",
            "Return to the ready position.",
          ],
          duration_seconds: 40,
        },
      ],

      "Build Strength": [
        {
          id: "tennis-squat",
          name: "Bodyweight Squats",
          how_to_do: [
            "Stand comfortably.",
            "Bend your knees and hips.",
            "Keep your posture controlled.",
            "Return to standing.",
          ],
          duration_seconds: 40,
        },
        {
          id: "tennis-lunge",
          name: "Forward Lunges",
          how_to_do: [
            "Stand upright.",
            "Step forward.",
            "Lower with control.",
            "Return to standing.",
          ],
          duration_seconds: 40,
        },
      ],

      "Improve Speed": [
        {
          id: "tennis-fast-feet",
          name: "Fast Feet",
          how_to_do: [
            "Start in a ready position.",
            "Move your feet quickly.",
            "Keep your body balanced.",
            "Maintain your rhythm.",
          ],
          duration_seconds: 30,
        },
        {
          id: "tennis-side-step",
          name: "Side-Step Drill",
          how_to_do: [
            "Start in a balanced position.",
            "Move sideways.",
            "Stay light on your feet.",
            "Return to your starting position.",
          ],
          duration_seconds: 40,
        },
      ],
    },
  };

  const sportPlan = plans[sport];

  if (sportPlan && sportPlan[goal]) {
    return sportPlan[goal];
  }

  /* General fallback */
  return [
    {
      id: "general-warmup",
      name: "Dynamic Warm-Up",
      how_to_do: [
        "Start with light movement.",
        "Gradually increase your pace.",
        "Keep your movements controlled.",
        "Prepare comfortably for the session.",
      ],
      duration_seconds: 30,
    },
    {
      id: "general-movement",
      name: "Movement Drill",
      how_to_do: [
        "Start in a balanced position.",
        "Move at a comfortable pace.",
        "Maintain good control.",
        "Return to the starting position.",
      ],
      duration_seconds: 40,
    },
  ];
}
/* =========================================================
   NUTRITION
========================================================= */

function NutritionPage({ profile }) {
  const [foodEntry, setFoodEntry] = useState({
    breakfast: "",
    lunch: "",
    snack: "",
    dinner: "",
  });
  useEffect(() => {
  async function loadTodayFood() {
    if (!profile?.id) return;

    try {
      const response = await fetch(
        `http://https://fitness-ai-8lc3.onrender.com/api/nutrition/food/${profile.id}`
      );

      if (!response.ok) return;

      const data = await response.json();

      const savedFood = {
        breakfast: "",
        lunch: "",
        snack: "",
        dinner: "",
      };

      data.foods.forEach((item) => {
        const meal = item.meal?.toLowerCase();

        if (meal === "breakfast") {
          savedFood.breakfast = item.food;
        } else if (meal === "lunch") {
          savedFood.lunch = item.food;
        } else if (meal === "snack") {
          savedFood.snack = item.food;
        } else if (meal === "dinner") {
          savedFood.dinner = item.food;
        }
      });

      setFoodEntry(savedFood);
    } catch (error) {
      console.log("Could not load today's food:", error);
    }
  }

  loadTodayFood();
}, [profile?.id]);

  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const meals = getIndianDiet(profile);

  function updateFoodEntry(meal, value) {
    setFoodEntry((prev) => ({
      ...prev,
      [meal]: value,
    }));
  }

  async function analyzeFood() {
    const combinedFood = `
Breakfast: ${foodEntry.breakfast}
Lunch: ${foodEntry.lunch}
Snack: ${foodEntry.snack}
Dinner: ${foodEntry.dinner}
    `.trim();

    if (
      !foodEntry.breakfast.trim() &&
      !foodEntry.lunch.trim() &&
      !foodEntry.snack.trim() &&
      !foodEntry.dinner.trim()
    ) {
      alert("Please enter what you ate today.");
      return;
    }

    setAnalyzing(true);

    try {
      const response = await fetch(
        "http://https://fitness-ai-8lc3.onrender.com/api/nutrition/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_id: profile.id,
            food: combinedFood,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        setAnalysis(data);
        setAnalyzing(false);

        return;
      }
    } catch (error) {
      console.log(
        "Nutrition API unavailable:",
        error
      );
    }

    /* =====================================================
       SAFE LOCAL FALLBACK
    ===================================================== */

    setAnalysis({
      summary:
        "Your food entry has been recorded. Connect the nutrition AI backend to calculate detailed nutritional values.",

      protein: "Not calculated",
      carbs: "Not calculated",
      calories: "Not calculated",
      fats: "Not calculated",
      fiber: "Not calculated",

      benefits:
        "Try to include a variety of grains, vegetables, fruits, dairy or other protein-rich foods, and enough fiber in your meals.",
    });

    setAnalyzing(false);
  }

  return (
    <div className="nutrition-page">

      {/* =====================================================
          PAGE INTRO
      ===================================================== */}

      <div className="page-intro">

        <p className="eyebrow">
          DAILY NUTRITION
        </p>

        <h2>
          Simple Indian Diet Plan
        </h2>

        <p>
          Affordable everyday meal suggestions
          for your routine.
        </p>

      </div>


      {/* =====================================================
          SUGGESTED FOOD
      ===================================================== */}

      <div className="nutrition-suggestion-section">

        <div className="section-heading left">

          <p className="eyebrow">
            FOOD SUGGESTIONS
          </p>

          <h2>
            What you can eat
          </h2>

          <p>
            Choose from these everyday food options.
          </p>

        </div>


        <div className="meal-table">

          {/* BREAKFAST */}

          <div className="meal-column">

            <div className="meal-column-header">
              <span className="meal-column-icon">
                🌅
              </span>

              <div>
                <strong>Breakfast</strong>
                <small>Morning</small>
              </div>
            </div>

            <div className="food-suggestion-list">

              {meals.breakfast.map(
                (food, index) => (
                  <div
                    className="food-suggestion"
                    key={index}
                  >
                    {food}
                  </div>
                )
              )}

            </div>

          </div>


          {/* LUNCH */}

          <div className="meal-column">

            <div className="meal-column-header">
              <span className="meal-column-icon">
                🍛
              </span>

              <div>
                <strong>Lunch</strong>
                <small>Afternoon</small>
              </div>
            </div>

            <div className="food-suggestion-list">

              {meals.lunch.map(
                (food, index) => (
                  <div
                    className="food-suggestion"
                    key={index}
                  >
                    {food}
                  </div>
                )
              )}

            </div>

          </div>


          {/* SNACK */}

          <div className="meal-column">

            <div className="meal-column-header">
              <span className="meal-column-icon">
                🍌
              </span>

              <div>
                <strong>Snack</strong>
                <small>Evening</small>
              </div>
            </div>

            <div className="food-suggestion-list">

              {meals.snack.map(
                (food, index) => (
                  <div
                    className="food-suggestion"
                    key={index}
                  >
                    {food}
                  </div>
                )
              )}

            </div>

          </div>


          {/* DINNER */}

          <div className="meal-column">

            <div className="meal-column-header">
              <span className="meal-column-icon">
                🌙
              </span>

              <div>
                <strong>Dinner</strong>
                <small>Night</small>
              </div>
            </div>

            <div className="food-suggestion-list">

              {meals.dinner.map(
                (food, index) => (
                  <div
                    className="food-suggestion"
                    key={index}
                  >
                    {food}
                  </div>
                )
              )}

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          ACTUAL FOOD LOG
      ===================================================== */}

      <div className="food-entry-card">

        <div className="section-heading left">

          <p className="eyebrow">
            DAILY FOOD LOG
          </p>

          <h2>
            What did you actually eat today?
          </h2>

          <p>
            Enter your actual meals. You can enter
            anything, even if it isn't in the suggestions.
          </p>

        </div>


        <div className="actual-food-grid">

          {/* BREAKFAST */}

          <div className="actual-food-box">

            <label>
              🌅 Breakfast
            </label>

            <textarea
              value={foodEntry.breakfast}
              onChange={(e) =>
                updateFoodEntry(
                  "breakfast",
                  e.target.value
                )
              }
              placeholder="Example: 2 poha bowls + milk"
            />

          </div>


          {/* LUNCH */}

          <div className="actual-food-box">

            <label>
              🍛 Lunch
            </label>

            <textarea
              value={foodEntry.lunch}
              onChange={(e) =>
                updateFoodEntry(
                  "lunch",
                  e.target.value
                )
              }
              placeholder="Example: 2 chapati + dal + vegetables"
            />

          </div>


          {/* SNACK */}

          <div className="actual-food-box">

            <label>
              🍌 Snack
            </label>

            <textarea
              value={foodEntry.snack}
              onChange={(e) =>
                updateFoodEntry(
                  "snack",
                  e.target.value
                )
              }
              placeholder="Example: banana + roasted chana"
            />

          </div>


          {/* DINNER */}

          <div className="actual-food-box">

            <label>
              🌙 Dinner
            </label>

            <textarea
              value={foodEntry.dinner}
              onChange={(e) =>
                updateFoodEntry(
                  "dinner",
                  e.target.value
                )
              }
              placeholder="Example: rice + dal + paneer"
            />

          </div>

        </div>


        <button
          className="btn primary"
          onClick={analyzeFood}
          disabled={analyzing}
        >
          {analyzing
            ? "Analyzing..."
            : "Analyze My Food"}
        </button>

      </div>


      {/* =====================================================
          NUTRITION REPORT
      ===================================================== */}

      {analysis && (

        <div className="nutrition-report">

          <p className="eyebrow">
            FOOD ANALYSIS
          </p>

          <h2>
            Your Nutrition Report
          </h2>

          <p>
            {analysis.summary}
          </p>


          <div className="nutrition-stats">

            <NutritionStat
              label="Calories"
              value={
                analysis.calories ||
                "Not available"
              }
            />

            <NutritionStat
              label="Protein"
              value={
                analysis.protein ||
                "Not available"
              }
            />

            <NutritionStat
              label="Carbs"
              value={
                analysis.carbs ||
                "Not available"
              }
            />

            <NutritionStat
              label="Fats"
              value={
                analysis.fats ||
                "Not available"
              }
            />

            <NutritionStat
              label="Fiber"
              value={
                analysis.fiber ||
                "Not available"
              }
            />

          </div>


          <div className="benefit-box">

            <h3>
              Nutrition Analysis
            </h3>

            <p>
              {analysis.benefits ||
                "A balanced diet supports everyday energy and wellbeing."}
            </p>

          </div>

        </div>

      )}

    </div>
  );
}


/* =========================================================
   NUTRITION STAT
========================================================= */

function NutritionStat({ label, value }) {
  return (
    <div className="nutrition-stat">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}


/* =========================================================
   INDIAN FOOD SUGGESTIONS
========================================================= */

function getIndianDiet(profile) {

  return {

    breakfast: [
      "Poha",
      "Upma",
      "Eggs",
      "Oats",
      "Milk",
    ],

    lunch: [
      "Chapati",
      "Dal",
      "Vegetables",
      "Curd",
      "Chicken",
    ],

    snack: [
      "Fruits & Nuts",
      "Sprouts",
      "Protein Bar",
      "Chilla",
      "Greek Yogurt",
    ],

    dinner: [
      "Rice",
      "Dal",
      "Paneer",
      "Chicken",
      "Salad",
    ],

  };
}
/* =========================================================
   SPORTS LEARNING
========================================================= */

function SportsLearningPage({ profile }) {
  const lessons = getSportLessons(
    profile.sport
  );

  const [selectedLesson, setSelectedLesson] =
    useState(0);

  return (
  <div>
    <div className="page-intro">
      <p className="eyebrow">SPORTS LEARNING</p>

      <h2>
        Learn {profile.sport}
      </h2>

      <p>
        Understand the basics, positions, rules
        and strategies.
      </p>
    </div>

    <div className="learning-layout">

      {/* LESSON LIST */}
      <div className="lesson-list">
        {lessons.map((lesson, index) => (
          <button
            key={lesson.title}
            className={
              selectedLesson === index
                ? "lesson-button active"
                : "lesson-button"
            }
            onClick={() => setSelectedLesson(index)}
          >
            <span>
              {String(index + 1).padStart(2, "0")}
            </span>

            <div>
              <strong>{lesson.title}</strong>

              <small>
                {lesson.type}
              </small>
            </div>
          </button>
        ))}
      </div>

      {/* LESSON CONTENT */}
      <div className="lesson-content">

        {/* 3D PLAYER */}
        <div className="lesson-visual">
          <SportsPlayer3D />

          <div className="position-marker marker-one">
            POSITION
          </div>

          <div className="position-marker marker-two">
            MOVEMENT
          </div>
        </div>

        {/* LESSON INFORMATION */}
        <div className="lesson-info">
          <p className="eyebrow">
            LESSON {selectedLesson + 1}
          </p>

          <h2>
            {lessons[selectedLesson].title}
          </h2>

          <p>
            {lessons[selectedLesson].description}
          </p>

          <InfoCard
            title="Key Points"
            items={lessons[selectedLesson].points}
          />
        </div>

      </div>
    </div>
  </div>
);
}

function getSportLessons(sport) {
  const common = {
    Football: [
      {
        title: "Ready Position",
        type: "Technique",
        description:
          "Learn the basic athletic position used before receiving or moving with the ball.",
        points: [
          "Keep your balance comfortable.",
          "Keep your eyes on the play.",
          "Stay ready to move.",
        ],
      },
      {
        title: "Basic Rules",
        type: "Rules",
        description:
          "Understand the basic objective, field structure and common rules.",
        points: [
          "Understand scoring.",
          "Learn common fouls.",
          "Know basic positions.",
        ],
      },
      {
        title: "Passing",
        type: "Technique",
        description:
          "Learn how controlled passing supports team play.",
        points: [
          "Look before passing.",
          "Use controlled movement.",
          "Communicate with teammates.",
        ],
      },
      {
        title: "Game Strategy",
        type: "Strategy",
        description:
          "Understand how positioning and teamwork affect play.",
        points: [
          "Maintain team shape.",
          "Move into useful space.",
          "Communicate consistently.",
        ],
      },
    ],

    Cricket: [
      {
        title: "Batting Stance",
        type: "Technique",
        description:
          "Learn the basic balanced stance used before facing a delivery.",
        points: [
          "Maintain a stable stance.",
          "Watch the ball.",
          "Stay ready to move.",
        ],
      },
      {
        title: "Basic Rules",
        type: "Rules",
        description:
          "Learn the basic structure of batting, bowling and scoring.",
        points: [
          "Understand runs.",
          "Learn wickets.",
          "Understand overs.",
        ],
      },
      {
        title: "Bowling Basics",
        type: "Technique",
        description:
          "Understand basic bowling preparation and controlled delivery.",
        points: [
          "Maintain a consistent approach.",
          "Focus on control.",
          "Follow the rules of delivery.",
        ],
      },
      {
        title: "Fielding",
        type: "Strategy",
        description:
          "Learn basic fielding positions and team awareness.",
        points: [
          "Stay alert.",
          "Communicate.",
          "Move efficiently.",
        ],
      },
    ],

    Basketball: [
      {
        title: "Ready Position",
        type: "Technique",
        description:
          "Learn the balanced position used when defending or preparing to move.",
        points: [
          "Stay balanced.",
          "Keep your eyes forward.",
          "Be ready to move.",
        ],
      },
      {
        title: "Basic Rules",
        type: "Rules",
        description:
          "Understand scoring, court areas and basic gameplay.",
        points: [
          "Learn scoring.",
          "Understand common violations.",
          "Know court positions.",
        ],
      },
      {
        title: "Dribbling",
        type: "Technique",
        description:
          "Learn controlled ball movement while keeping awareness of the court.",
        points: [
          "Keep control of the ball.",
          "Look around the court.",
          "Change direction carefully.",
        ],
      },
      {
        title: "Team Strategy",
        type: "Strategy",
        description:
          "Learn how spacing and teamwork create opportunities.",
        points: [
          "Maintain spacing.",
          "Communicate.",
          "Move into open areas.",
        ],
      },
    ],

    Tennis: [
      {
        title: "Ready Position",
        type: "Technique",
        description:
          "Learn the balanced court position used before responding to a shot.",
        points: [
          "Stay balanced.",
          "Keep your eyes on the ball.",
          "Prepare for movement.",
        ],
      },
      {
        title: "Basic Rules",
        type: "Rules",
        description:
          "Understand scoring, court areas and basic match structure.",
        points: [
          "Learn scoring.",
          "Understand serving.",
          "Know court boundaries.",
        ],
      },
      {
        title: "Groundstroke Basics",
        type: "Technique",
        description:
          "Learn the fundamentals of controlled forehand and backhand movement.",
        points: [
          "Prepare early.",
          "Maintain balance.",
          "Focus on controlled contact.",
        ],
      },
      {
        title: "Court Strategy",
        type: "Strategy",
        description:
          "Understand basic positioning and shot selection.",
        points: [
          "Recover after shots.",
          "Use court space.",
          "Stay aware of your opponent.",
        ],
      },
    ],
  };

  return common[sport] || common.Football;
}

function InfoCard({ title, items }) {
  return (
    <div className="info-card">

      <h3>{title}</h3>

      <ul>
        {items.map((item) => (
          <li key={item}>
            <span>✓</span>
            {item}
          </li>
        ))}
      </ul>

    </div>
  );
}
/* =========================================================
   FOOD SCANNER
========================================================= */

function FoodScannerPage({ profile }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Keep scanner result even when changing dashboard tabs
  useEffect(() => {
    try {
      const userKey =
        profile?.id ||
        profile?.user_id ||
        profile?.email ||
        "guest";

      const saved = localStorage.getItem(
        `fitai-food-scanner-${userKey}`
      );

      if (saved) {
        const savedData = JSON.parse(saved);

        setResult(savedData.result || null);
        setPreview(savedData.preview || "");
      }
    } catch (error) {
      console.error("Could not load saved food scan:", error);
    }
  }, [profile]);

  function handleImage(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImage(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    // Don't remove previous result until new scan is completed
  }

  async function scanFood() {
    if (!image) {
      alert("Please upload a food image first.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", image);

      if (profile?.id || profile?.user_id) {
        formData.append(
          "user_id",
          profile.id || profile.user_id
        );
      }

      const response = await fetch(
        "http://https://fitness-ai-8lc3.onrender.com/api/food-scanner/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.detail ||
            "Food analysis failed."
        );

        setLoading(false);
        return;
      }

      // Save the new result
      setResult(data);

      // Save result + image preview locally
      try {
        const userKey =
          profile?.id ||
          profile?.user_id ||
          profile?.email ||
          "guest";

        localStorage.setItem(
          `fitai-food-scanner-${userKey}`,
          JSON.stringify({
            result: data,
            preview: preview,
          })
        );
      } catch (storageError) {
        console.error(
          "Could not save food scanner result:",
          storageError
        );
      }
    } catch (error) {
      console.error(
        "Food scanner error:",
        error
      );

      alert(
        "Cannot connect to the food scanner backend."
      );
    }

    setLoading(false);
  }

  return (
    <div>
      <div className="page-intro">
        <p className="eyebrow">
          AI FOOD ANALYSIS
        </p>

        <h2>Food Scanner</h2>

        <p>
          Upload a food image and get an AI-powered
          nutrition analysis.
        </p>
      </div>

      <div className="scanner-layout">

        {/* =========================
            UPLOAD CARD
        ========================= */}

        <div className="scanner-upload-card">

          <div className="scanner-icon">
            📷
          </div>

          <h2>
            Upload Food Image
          </h2>

          <p>
            Choose a clear picture of your food,
            packaged food or food label.
          </p>

          <label className="upload-button">
            Choose Image

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              hidden
            />
          </label>

          {preview && (
            <img
              className="food-preview"
              src={preview}
              alt="Food preview"
            />
          )}

          <button
            className="btn primary"
            onClick={scanFood}
            disabled={loading}
          >
            {loading
              ? "Analyzing..."
              : "Scan Food"}
          </button>
        </div>


        {/* =========================
            RESULT
        ========================= */}

        {result && (
          <div className="scanner-result">

            <p className="eyebrow">
              AI RESULT
            </p>

            <h2>
              {result.food_name ||
                result.name ||
                "Food Analysis"}
            </h2>


            {/* =========================
                NUTRITION
            ========================= */}

            <div className="nutrition-stats">

              <NutritionStat
                label="Calories"
                value={
                  result.calories ??
                  "Not available"
                }
              />

              <NutritionStat
                label="Protein"
                value={
                  result.protein ??
                  "Not available"
                }
              />

              <NutritionStat
                label="Carbs"
                value={
                  result.carbs ??
                  "Not available"
                }
              />

              <NutritionStat
                label="Fat"
                value={
                  result.fat ??
                  result.fats ??
                  "Not available"
                }
              />

              <NutritionStat
                label="Fiber"
                value={
                  result.fiber ??
                  "Not available"
                }
              />

            </div>


            {/* =========================
                INGREDIENTS
            ========================= */}

            <InfoCard
              title="Ingredients"
              items={
                Array.isArray(result.ingredients)
                  ? result.ingredients
                  : [
                      result.ingredients ||
                        "Ingredient information is not available."
                    ]
              }
            />


            {/* =========================
                BENEFITS
            ========================= */}

            <InfoCard
              title="Nutritional Benefits"
              items={
                Array.isArray(result.benefits)
                  ? result.benefits
                  : [
                      result.benefits ||
                        "Benefits information is not available."
                    ]
              }
            />


            {/* =========================
                HEALTH INFORMATION
            ========================= */}

            <InfoCard
              title="Health Information"
              items={[
                result.health_effects ||
                  result.healthEffects ||
                  "Health information is not available."
              ]}
            />


            {/* =========================
                THINGS TO NOTICE
            ========================= */}

            {(result.concerns ||
              result.warnings ||
              result.things_to_consider) && (
              <InfoCard
                title="Things to Consider"
                items={[
                  result.concerns ||
                    result.warnings ||
                    result.things_to_consider
                ]}
              />
            )}

          </div>
        )}

      </div>
    </div>
  );
}

/* =========================================================
   AI COACH
========================================================= */

function AICoachPage({ profile }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load previous chat history
  useEffect(() => {
    async function loadHistory() {
      try {
        const userId = profile?.id || profile?.user_id;

        if (!userId) {
          setMessages([
            {
              role: "assistant",
              text: "Hi! I'm your FITNESS-AI Coach. Ask me anything.",
            },
          ]);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://https://fitness-ai-8lc3.onrender.com/api/ai-coach/history/${userId}`
        );

        const data = await response.json();

        if (response.ok && data.success) {
          const historyMessages = [];

          data.history.forEach((chat) => {
            historyMessages.push({
              role: "user",
              text: chat.question,
            });

            historyMessages.push({
              role: "assistant",
              text: chat.answer,
            });
          });

          if (historyMessages.length === 0) {
            historyMessages.push({
              role: "assistant",
              text: "Hi! I'm your FITNESS-AI Coach. Ask me anything.",
            });
          }

          setMessages(historyMessages);
        } else {
          setMessages([
            {
              role: "assistant",
              text: "Hi! I'm your FITNESS-AI Coach. Ask me anything.",
            },
          ]);
        }
      } catch (error) {
        console.error("AI Coach history error:", error);

        setMessages([
          {
            role: "assistant",
            text: "Hi! I'm your FITNESS-AI Coach. Ask me anything.",
          },
        ]);
      }

      setLoading(false);
    }

    loadHistory();
  }, [profile]);

  async function sendMessage() {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    // Show user's message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const userId = profile?.id || profile?.user_id;

      const response = await fetch(
        "http://https://fitness-ai-8lc3.onrender.com/api/ai-coach/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            question: userMessage,
            sport: profile?.sport || null,
            goal: profile?.goal || null,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.answer,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text:
              data.detail ||
              "I couldn't process that question right now.",
          },
        ]);
      }
    } catch (error) {
      console.error("AI Coach error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "The AI Coach backend is currently unavailable.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div>
      <div className="page-intro">
  <p className="eyebrow">PERSONAL AI ASSISTANT</p>

  <div className="coach-title-row">
    <div>
      <h2>AI Coach</h2>
      <p>
        Ask questions and get short, simple answers from your AI Coach.
      </p>
    </div>

    <button
      className="btn secondary"
      onClick={() =>
        setMessages([
          {
            role: "assistant",
            text: "Hi! I'm your FITNESS-AI Coach. Ask me anything.",
          },
        ])
      }
    >
      + New Chat
    </button>
  </div>
</div>
      <div className="coach-card">
        <div className="coach-messages">
          {messages.map((item, index) => (
            <div
              key={index}
              className={
                item.role === "user"
                  ? "chat-message user"
                  : "chat-message assistant"
              }
            >
              {item.text}
            </div>
          ))}

          {loading && messages.length > 0 && (
            <div className="chat-message assistant">
              Thinking...
            </div>
          )}
        </div>

        <div className="coach-input">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                sendMessage();
              }
            }}
            placeholder="Ask your AI Coach anything..."
            disabled={loading}
          />

          <button
            className="btn primary"
            onClick={sendMessage}
            disabled={loading || !message.trim()}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage({
  profile,
  setProfile,
}) {
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function saveSettings() {
    if (!profile.id) {
      setProfile(form);
      alert("Settings updated.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `http://https://fitness-ai-8lc3.onrender.com/api/auth/profile/${profile.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  name: form.name,
  email: form.email,
  sport: form.sport,
  goal: form.goal,
  experience_level: form.level,
}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.detail ||
            "Could not update profile."
        );

        setSaving(false);
        return;
      }

      setProfile((prev) => ({
        ...prev,
        ...form,
        name:
          data.user?.name || form.name,
        email:
          data.user?.email || form.email,
        sport:
          data.user?.sport || form.sport,
        goal:
          data.user?.goal || form.goal,
      }));

      alert("Profile updated successfully.");
    } catch (error) {
      console.error(
        "Settings error:",
        error
      );

      setProfile(form);

      alert(
        "Backend unavailable. Local profile updated."
      );
    }

    setSaving(false);
  }

  return (
    <div>

      <div className="page-intro">

        <p className="eyebrow">
          PROFILE
        </p>

        <h2>
          Settings
        </h2>

        <p>
          Manage your FITNESS-AI profile.
        </p>

      </div>

      <div className="settings-card">

        <div className="settings-section">

          <h3>
            Basic Information
          </h3>

          <div className="settings-grid">

            <div>
              <label>Name</label>

              <input
                value={form.name || ""}
                onChange={(e) =>
                  updateField(
                    "name",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label>Email</label>

              <input
                type="email"
                value={form.email || ""}
                onChange={(e) =>
                  updateField(
                    "email",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label>Age</label>

              <input
                value={form.age || ""}
                disabled
              />
            </div>

            <div>
              <label>Gender</label>

              <input
                value={form.gender || ""}
                disabled
              />
            </div>

          </div>

        </div>

        <div className="settings-section">

          <h3>
            Fitness Preferences
          </h3>

          <label>Sport</label>

          <select
            value={form.sport || "Football"}
            onChange={(e) =>
              updateField(
                "sport",
                e.target.value
              )
            }
          >
            {SPORTS.map((sport) => (
              <option
                key={sport}
                value={sport}
              >
                {sport}
              </option>
            ))}
          </select>

          <label>Goal</label>

          <select
            value={
              form.goal ||
              "Improve Fitness"
            }
            onChange={(e) =>
              updateField(
                "goal",
                e.target.value
              )
            }
          >
            {GOALS.map((goal) => (
              <option
                key={goal}
                value={goal}
              >
                {goal}
              </option>
            ))}
          </select>

          <label>
            Experience Level
          </label>

          <select
            value={
              form.level || "Beginner"
            }
            onChange={(e) =>
              updateField(
                "level",
                e.target.value
              )
            }
          >
            {LEVELS.map((level) => (
              <option
                key={level}
                value={level}
              >
                {level}
              </option>
            ))}
          </select>

        </div>

        <button
          className="btn primary"
          onClick={saveSettings}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>

      </div>

    </div>
  );
}

export default App;