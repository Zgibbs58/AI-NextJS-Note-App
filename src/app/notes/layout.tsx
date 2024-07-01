import NavBar from "./NavBar"

export default function Layout({
     children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
        <NavBar />
        <main className="m-auto p-4 max-w-7xl">{children}</main>
    </>
  )
}

