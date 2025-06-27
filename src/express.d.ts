import { JwtPayload } from './authentication/interfaces/jwt-payload.interface'

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
      query?: any
    }
  }
}
