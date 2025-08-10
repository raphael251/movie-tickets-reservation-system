export enum SCREENING_SEAT_STATUS {
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  RESERVED = 'RESERVED',
}

export class ScreeningSeat {
  constructor(
    public id: string,
    public screeningId: string,
    public rowLabel: string,
    public seatNumber: string,
    public status: SCREENING_SEAT_STATUS,
  ) {}
}
