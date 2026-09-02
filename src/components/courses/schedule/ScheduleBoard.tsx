import MonthCarousel from './MonthCarousel';
import TrackCard from './TrackCard';
import { MONTHS, TRACKS } from './data';

export default function ScheduleBoard() {
  return (
    <div className="bg-white">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8 md:gap-10 md:px-6 md:py-12">
        <MonthCarousel months={MONTHS} />
        {TRACKS.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
