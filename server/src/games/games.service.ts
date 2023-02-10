import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './entities/game.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GamesService {
  private games: Game[] = [];

  getAllGames(): Game[] {
    return this.games;
  }

  getGame(id: string): Game {
    const game = this.games.find((game) => game.id == id);
    if (!game) {
      throw new NotFoundException(`Not found game with ID: ${id} `);
    }
    return game;
  }

  createGame(createGameDto: CreateGameDto): Game {
    const newGame = {
      id: uuidv4(),
      name: createGameDto.name,
      cnt: 0,
      started: false,
    };
    this.games.push(newGame);
    return newGame;
  }

  leaveGame(id: string): void {
    this.games.forEach((game, index) => {
      if (game.id === id) {
        this.games.splice(index, 1, {
          id: game.id,
          name: game.name,
          cnt: game.cnt - 1,
          started: true,
        });
      }
    });
  }

  joinGame(id: string): void {
    this.games.forEach((game, index) => {
      if (game.id === id) {
        this.games.splice(index, 1, {
          id: game.id,
          name: game.name,
          cnt: game.cnt + 1,
          started: true,
        });
      }
    });
  }

  deleteGame(id: string): void {
    this.getGame(id);
    this.games.filter((game) => game.id !== id);
  }
}
