import { Request, Response, Router } from 'express';
const router = Router();
const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  console.log(
    'email, username, password',
    `${email}, ${username}, ${password}`
  );
};
router.post('/register', register);
export default router;
