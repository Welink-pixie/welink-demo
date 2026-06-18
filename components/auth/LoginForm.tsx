// components/auth/LoginForm.tsx

export default function LoginForm() {
  return (
    <section className="flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">

        {/* Logo */}

        <div className="mb-8 flex items-center gap-4">
          <img
            src="/we_link_logo.png"
            alt="WeLink"
            className="h-12 w-auto shrink-0 object-contain"
          />

          <h1 className="text-3xl font-bold leading-none text-slate-900">
            WeLink
          </h1>
        </div>

        {/* Heading */}

        <h2 className="text-3xl font-bold text-slate-900">
          Welcome Back
        </h2>

        <p className="mt-2 text-slate-500">
          Sign in to access your network.
        </p>

        {/* Form */}

        <form className="mt-8 space-y-5">

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              placeholder="selena@demacco.com"
              className="
                mt-2
                w-full
                rounded-2xl
                border
                border-slate-200
                px-4
                py-3
                outline-none
                transition
                focus:border-violet-500
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="
                mt-2
                w-full
                rounded-2xl
                border
                border-slate-200
                px-4
                py-3
                outline-none
                transition
                focus:border-violet-500
              "
            />
          </div>

          <button
            type="submit"
            className="
              w-full
              rounded-2xl
              bg-slate-950
              py-3
              font-semibold
              text-white
              transition
              hover:bg-slate-800
            "
          >
            Sign In
          </button>

        </form>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center">
          <p className="text-sm text-slate-500">
            New to WeLink?
          </p>

          <button className="mt-2 font-semibold text-violet-600 hover:text-violet-700">
            Request Access
          </button>
        </div>

      </div>
    </section>
  );
}