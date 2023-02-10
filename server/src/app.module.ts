import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [EventsModule, GamesModule],
})
export class AppModule {}
