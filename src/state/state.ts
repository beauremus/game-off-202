let vars = {
  score: 0,
  highscore: 0,
  lives: 3,
}

const consts = {
  SHIP_SIZE: 20,
  ASTEROID_COUNT: 3,
  ASTEROID: {
    LARGE: {
      MAXSIZE: 100,
      MINSIZE: 50,
      MAXSPEED: 3,
      MINSPEED: 1,
    },
    MEDIUM: {
      MAXSIZE: 50,
      MINSIZE: 30,
      MAXSPEED: 4,
      MINSPEED: 1,
    },
    SMALL: {
      MAXSIZE: 30,
      MINSIZE: 10,
      MAXSPEED: 4,
      MINSPEED: 2,
    },
  },
};

export {
  vars,
  consts
}
