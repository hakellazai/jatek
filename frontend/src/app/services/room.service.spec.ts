import { TestBed } from '@angular/core/testing';
import { RoomService } from './room.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoomService],
    });
    service = TestBed.inject(RoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get current room', () => {
    const room = {
      id: 1,
      name: 'Test Room',
      host: 'player1',
      max_players: 2,
      current_players: 1,
      is_private: false,
      status: 'open' as const,
      created_at: '2025-01-28',
    };

    service.setCurrentRoom(room);
    expect(service.getCurrentRoom()).toEqual(room);
  });
});
