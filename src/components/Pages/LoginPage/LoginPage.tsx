import Button from '@/components/Generic/Button/Button'
import Input from '@/components/Generic/Input/InputField'
import { MdOutlineMail, MdLock } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'
import UserService from '@/lib/services/userService/UserService'
import { redirect } from 'next/navigation'

const SignIn = () => {
  // const [email, setEmail] = useState<string>('')
  // const [password, setPassword] = useState<string>('')
  //const emailInputRef = useRef<HTMLInputElement>(null)
  //const passwordInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormData) => {
    'use server'
    const email = e.get('email') as string
    const password = e.get('password') as string
    console.log(email, password)
    if (!email || !password) return
    /*const response = await fetch('http://localhost:3000/api/auth/login', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      method: 'POST',
      mode: 'cors',
    })*/

    const { message, status, error, details } = await UserService.login({ email, password })
    console.log(message, status, error, details)

    if (status === 200) {
      console.log('Login successful')
      redirect('/')
    } else {
      console.log(message, error, details)
    }
  }

  return (
    <div className="flex flex-col justify-center items-start gap-4">
      <p className="text-xl font-extrabold text-dark-blue pl-2">WELCOME BACK</p>
      <form action={handleSubmit}>
        <div className="flex flex-col gap-4">
          <Input
            name="email"
            placeholder="Email Address"
            // ref={emailInputRef}
            type="email"
            startIcon={<MdOutlineMail className="text-muted-blue h-full" />}
            // value={email}
            // onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            startIcon={<MdLock className="text-muted-blue h-full" />}
            //value={password}
            //onChange={(e) => setPassword(e.target.value)}
            // ref={passwordInputRef}
          />
          <Button size="md" variant="dark" type="submit">
            <p className="text-xs">Login</p>
          </Button>
          <p className="text-steel-blue text-xs text-center">
            {"Don't have an account? Sign up "}
            <Link href="/auth/register">
              <u>here</u>
            </Link>
          </p>
          <div>
            <div className="flex items-center w-full pt-2 pb-3">
              <div className="border-t border-steel-blue flex-grow"></div>
              <span className="mx-4 text-steel-blue text-xs">OR</span>
              <div className="border-t border-steel-blue flex-grow"></div>
            </div>
            <Button
              className="bg-white w-full"
              size="md"
              variant="outline"
              startIcon={<FcGoogle className="h-full" />}
            >
              <Link href="/" className="text-xs">
                Sign In with Google
              </Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignIn
