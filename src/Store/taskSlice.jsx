const initialState = {
    tasks: [],
};

const taskSlice = createSlice({
    name:"tasks",
    initialState,
    reducers: {
        addTasks
    }
})