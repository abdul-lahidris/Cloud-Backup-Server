
const sample = 'qwertyuiopasdfghjklzxcvbnm0987612345';
export const RandomEmail = (): string => {
    const randoms: number[] = [];

    for (let i = 0; i < 9; i++) {
        randoms.push(Math.floor(Math.random()*(sample.length-1)));
    }
 return `${sample[randoms[0]]}${sample[randoms[1]]}${sample[randoms[2]]}${sample[randoms[3]]}${sample[randoms[4]]}.${sample[randoms[5]]}${sample[randoms[6]]}${sample[randoms[7]]}${sample[randoms[8]]}@rand.com`
}