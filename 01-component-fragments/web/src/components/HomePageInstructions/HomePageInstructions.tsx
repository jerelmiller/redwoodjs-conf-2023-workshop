import readme from 'src/README.md?raw'

const HomePageInstructions = () => {
  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col p-[var(--main-content--padding)]">
      {readme}
    </div>
  )
}

export default HomePageInstructions
