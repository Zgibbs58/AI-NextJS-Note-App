import { SignIn } from '@clerk/nextjs'
import {Metadata} from 'next'

export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Sign in to your account',
}

export default function Page() {
    return (
        <div className='flex h-screen justify-center items-center'>
            <SignIn appearance={{ variables: {colorPrimary: "#0F172A"}}} />
        </div>
    )
    }