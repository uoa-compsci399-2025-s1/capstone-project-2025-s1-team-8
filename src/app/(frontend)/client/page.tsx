export default function Client() {
  return (
    <div className="flex flex-row justify-between items-center min-h-screen">
      {/*Leftside*/}
      <div className="flex flex-col justify-center items-center min-h-screen min-w-[50vw] bg-gradient-to-t from-[#88B8C4] via-[#A7CAD1] to-[C6DCDE]">
        <h1>Encapsulate</h1>
        <h2>Submit your project proposal today!</h2>
        <button>Read More</button>
      </div>
      {/*Rightside*/}
      <div className="flex flex-col items-center">
        <h1>Welcome back</h1>
        <form>
          <div className="flex flex-col">
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Sign In</button>
            <p>
              Don't have an account? <a href="/auth/signup">Sign Up</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
