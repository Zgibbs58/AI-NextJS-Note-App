import { SignUp } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='flex h-screen justify-center items-center'>
            <SignUp appearance={{ variables: {colorPrimary: "#0F172A"}}} />
        </div>
    )
    }