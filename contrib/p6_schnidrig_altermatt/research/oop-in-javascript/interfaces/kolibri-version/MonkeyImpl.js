export { Monkey }

const Monkey = () => ({
    eat: () => {
        console.log('Monkey is eating a banana');
        return 1;
    },
    move: () => console.log('Monkey is climbing'),
    talk: sound => console.log('Monkey says: ' + sound),
    die: () => console.log('Monkey is dying')
});