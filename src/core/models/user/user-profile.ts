import { PerformanceRating } from './performance-rating';

export class UserProfile {
    public name = '';
    public avatarUrl = '';
    public ratings = new PerformanceRating();
}
