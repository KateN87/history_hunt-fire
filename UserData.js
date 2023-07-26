export default UserData = [
    {
        userId: 1,
        email: 'hermione@hermione.com',
        name: 'Hermione',
        password: 'abcABC123!',
        image: require('./assets/profilepics/hermionespic.webp'),
        activeHunts: [{ hunt: 1, with: ['Ron', 'Harry'] }],
        plannedHunts: [],
        medals: [],
    },
    {
        userId: 2,
        email: 'harry@harry.com',
        name: 'Harry',
        password: 'abcABC123!',
        image: require('./assets/profilepics/harryspic.webp'),
        activeHunts: [],
        plannedHunts: [],
        medals: [],
    },
];

export const Huntsdata = [
    {
        huntId: 1,
        title: 'Killing Voldemort',
    },
];
