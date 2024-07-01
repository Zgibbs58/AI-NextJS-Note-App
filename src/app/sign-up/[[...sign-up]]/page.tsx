import { SignUp } from '@clerk/nextjs'
import {Metadata} from 'next'

export const metadata: Metadata = {
    title: 'Sign Up',
    description: 'Sign up for an account',
}

export default function Page() {
    return (
        <div className='flex h-screen justify-center items-center'>
            <SignUp appearance={{ variables: {colorPrimary: "#0F172A"}}} />
        </div>
    )
    }