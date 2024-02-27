import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { inRange } from 'lodash'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const amalan = ['rawatib', 'dhuha', 'mengaji', 'tahajud', 'infaq']

export function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

export function sumTotal(convertedResult) {
  let total = 0
  let multipliers = {
    rawatib: 2,
    dhuha: 2,
    infaq: 3/10000,
    tahajud: 5,
    mengaji: 3
  }

  for (let prop in convertedResult) {
    if (multipliers[prop] && amalan.includes(prop)) {
      total += convertedResult[prop] * multipliers[prop]
    }
  }

  return total
}

export const level = (exp) => {
  switch (true) {
    case inRange(exp, 0, 154):
      return 1
    case inRange(exp, 155, 308):
      return 2
    case inRange(exp, 309, 462):
      return 3
    case inRange(exp, 463, 616):
      return 4
    case inRange(exp, 617, 770):
      return 5
    case inRange(exp, 771, 924):
      return 6
    case inRange(exp, 925, 1078):
      return 7
    case inRange(exp, 1079, 1232):
      return 8
    case inRange(exp, 1233, 1386):
      return 9
    case inRange(exp, 1387, 1540):
      return 10
    case inRange(exp, 1541, 1694):
      return 11
    case inRange(exp, 1695, 1848):
      return 12
    case inRange(exp, 1849, 2002):
      return 13
    case inRange(exp, 2003, 2156):
      return 14
    case inRange(exp, 2157, 2310):
      return 15
    case inRange(exp, 2311, 2464):
      return 16
    case inRange(exp, 2465, 2618):
      return 17
    case inRange(exp, 2619, 2772):
      return 18
    case inRange(exp, 2773, 2926):
      return 19
    case inRange(exp, 2927, 3080):
      return 20
    case inRange(exp, 3081, 3234):
      return 21
    case inRange(exp, 3235, 3388):
      return 22
    case inRange(exp, 3389, 3542):
      return 23
    case inRange(exp, 3543, 3696):
      return 24
    case inRange(exp, 3697, 3850):
      return 25
    case inRange(exp, 3851, 4004):
      return 26
    case inRange(exp, 4005, 4158):
      return 27
    case inRange(exp, 4159, 4312):
      return 28
    case inRange(exp, 4313, 4466):
      return 29
    case inRange(exp, 4467, 4620):
      return 30
    case inRange(exp, 4621, 4820):
      return 31
    case inRange(exp, 4821, 5020):
      return 32
    case inRange(exp, 5021, 5220):
      return 33
    case inRange(exp, 5221, 5420):
      return 34
    case exp > 5420:
      return 'Immortal'
  }
}

export const rank = (level) => {
  switch (true) {
    case inRange(level, 1, 5):
      return 'Herald'
    case inRange(level, 6, 10):
      return 'Guardian'
    case inRange(level, 11, 15):
      return 'Crusader'
    case inRange(level, 16, 20):
      return 'Archon'
    case inRange(level, 21, 25):
      return 'Legend'
    case inRange(level, 26, 30):
      return 'Ancient'
    case inRange(level, 31, 35):
      return 'Divine'
    default:
      return 'Immortal'
  }
}