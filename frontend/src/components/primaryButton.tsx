export default function PrimaryButton({ text, href }: { text: string, href: string }) {
  return (
    <a
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
      href={href}
    >
      {text}
    </a>
  )
}
