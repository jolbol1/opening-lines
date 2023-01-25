import { AnimatePresence, motion } from 'framer-motion'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import useSWR, { Key, Fetcher } from 'swr'
import { DropDown } from '../components/DropDown'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { LoadingDots } from '../components/LoadingDots'
import { ResizablePanel } from '../components/ResizablePanel'

type PromptData = {
  [key: string]: string[]
}

const fetcher: Fetcher<PromptData, string> = (url: string) =>
  fetch(url).then((res) => res.json())

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const [bio, setBio] = useState('')
  const [name, setName] = useState('')
  const [vibe, setVibe] = useState<string>('Casual')
  const [generatedBios, setGeneratedBios] = useState<string>('')
  const { data } = useSWR<PromptData>('/api/prompts', fetcher)

  const prompt = () => {
    const prompts: string[] = (data as PromptData)[vibe]
    let randomPrompt: string =
      prompts[Math.floor(Math.random() * prompts.length)]
    randomPrompt = randomPrompt.replaceAll('%name', name)
    return `Generate 2 ${
      randomPrompt || ''
    }. Clearly label these "1." and "2.". ${
      bio &&
      `Make sure each generated message uses some of this context: ${bio}${
        bio.slice(-1) === '.' ? '' : '.'
      }`
    }`
  }

  const generateBio = async () => {
    setGeneratedBios('')
    setLoading(true)
    const promptMessage = prompt()
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: promptMessage,
      }),
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // This data is a ReadableStream
    const responseData = response.body
    if (responseData === undefined || responseData === null) {
      return
    }

    const reader = responseData.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      // eslint-disable-next-line no-await-in-loop
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      setGeneratedBios((prev) => prev + chunkValue)
    }

    setLoading(false)
  }

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Opening Lines</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-6 sm:mt-10">
        <h1 className="sm:text-6xl text-4xl max-w-2xl font-bold text-white">
          Generate your first message in seconds!
        </h1>
        <div className="max-w-xl bg-slate-800 rounded-lg p-6 mt-10 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-60 border border-gray-500">
          <div className="flexitems-center space-x-3 mb-5">
            <p className="text-left font-medium text-gray-100">
              Enter their name
            </p>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
            className="input w-full mb-5"
            placeholder="e.g. Kate"
          />
          <div className="flexitems-center space-x-3 mb-5">
            <p className="text-left font-medium text-gray-100">
              Optional: Write some sentences about them{' '}
              <span className="text-slate-500">(or copy their bio)</span>
            </p>
          </div>
          <textarea
            value={bio}
            onChange={(e) => {
              setBio(e.target.value)
            }}
            rows={4}
            className="textarea w-full mb-5"
            placeholder="e.g. Loves dogs, has a photo with their cat, likes star wars"
          />
          <div className="flex mb-5 items-center space-x-3">
            <p className="text-left font-medium text-gray-100">
              Select your vibe
            </p>
          </div>
          {data ? (
            <div className="block">
              <DropDown
                vibes={(data as object) && Object.keys(data as object)}
                vibe={vibe}
                setVibe={(newVibe) => {
                  setVibe(newVibe)
                }}
              />
            </div>
          ) : (
            <p>Loading...</p>
          )}

          {!loading && (
            <button
              className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8  w-full"
              type="button"
              onClick={async () => {
                await generateBio()
              }}
            >
              Generate your first message &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              type="button"
              disabled
            >
              <LoadingDots color="white" size="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 mt-3 max-w-xl mx-auto p-6">
              {generatedBios && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-white mx-auto">
                      Pick your opener!
                    </h2>
                  </div>
                  <div className="chat chat-end bg-slate-800 rounded-xl p-2 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-60 border border-gray-500">
                    {generatedBios
                      .slice(Math.max(0, generatedBios.indexOf('1') + 3))
                      .split('2.')
                      .map((generatedBio) => (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                        <div
                          className="chat-bubble chat-bubble-info cursor-copy my-3 text-white text-left"
                          role="cell"
                          onClick={() => {
                            navigator.clipboard
                              .writeText(generatedBio)
                              .then(() => {
                                toast('Copied to clipboard', {
                                  icon: '✂️',
                                })
                                return true
                              })
                              .catch(() => {
                                toast('Error copying to clipboard', {
                                  icon: '✂️',
                                })
                                return false
                              })
                          }}
                          key={generatedBio}
                        >
                          <p>{generatedBio}</p>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </div>
      <Footer />
    </div>
  )
}

// eslint-disable-next-line import/no-default-export
export default Home
