import Markdown from 'src/components/Markdown'
import readme from 'src/README.md?raw'

const HomePageInstructions = () => {
  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col py-[var(--main-content--padding)]">
      <Markdown>{readme}</Markdown>
    </div>
  )
}

export default HomePageInstructions
