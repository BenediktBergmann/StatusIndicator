import { Activity } from './activity';
import { Availability } from "./availability";

export interface Presence {
  id: string;
  availability: Availability;
  activity: Activity;
}