import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { fullName, email, password, roleId } = req.body;

      // Валидация входных данных
      if (!fullName || !email || !password || roleId === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const response = await fetch('http://localhost:5080/api/Users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password, roleId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to register user: ${errorText}`);
        return res.status(response.status).json({ error: `Failed to register user: ${response.statusText}` });
      }

      const result = await response.json();
      console.log('Registered user:', result);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ error: 'Failed to register user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
