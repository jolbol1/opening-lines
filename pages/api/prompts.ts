import path from 'path'
import { promises as fs } from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'json')
  //Read the json data file data.json
  const fileContents = await fs.readFile(
    jsonDirectory + '/prompts.json',
    'utf8',
  )
  const obj = JSON.parse(fileContents)
  //Return the content of the data file in json format
  res.status(200).json(obj)
}
