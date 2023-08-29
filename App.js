import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from "react-native";


const App = () => {

    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Call API
    const getDatas = (page) => {
        fetch("https://api.themoviedb.org/3/discover/movie?api_key=26763d7bf2e94098192e629eb975dab0&page=" + page)
            .then(response => response.json())
            .then(responseData => {
                if (page === 1) {
                    setData(responseData.results);
                    setRefreshing(false);
                } else {
                    if (Array.isArray(responseData.results)) {
                        setData([...data, ...responseData.results]);
                        setLoadingMore(false);
                    } else {
                        console.log("responseData is not an array")
                    }
                }
            })
            .catch(err => console.log(err))
    }

    // Load more data
    const loadMoreData = async () => {
        setLoadingMore(true);
        setPage(page + 1)
        getDatas(page);
    };

    // refresh 
    const handleRefresh = () => {
        setRefreshing(true);
        getDatas(1);

    };

    // custom title
    const formatTitle = (text) => {
        if (text.length >= 15) {
            const newText = text.slice(0, 15 - 3) + "..."
            return <Text>{newText}</Text>
        } else {
            return <Text>{text}</Text>
        }
    }
    // custom date    
    const formatDate = (date) => {
        const newDate = date.split("-")
        return newDate[0]
    }

    useEffect(() => {
        getDatas(1)
    }, [])

    return (
        <View style={{
            flex: 1, paddingHorizontal: 20
        }}>
            <View style={{
                flexDirection: "row", marginTop: 20, alignItems: "center"
            }}>
                <Image style={{
                    width: 22, height: 22,
                }} source={require("./image/back.png")} />
                <Text style={{
                    fontSize: 20, marginLeft: 10, color: "black"
                }}>Back</Text>
            </View>
            <Text style={{
                marginTop: 20, fontSize: 20, fontWeight: "bold"
            }}>Popular list</Text>

            {/* list items */}

            <FlatList
                initialNumToRender={10}
                windowSize={20}
                style={{
                    marginTop: 20
                }}
                onEndReached={loadMoreData}
                data={data}
                keyExtractor={item => item.id}
                numColumns={2}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['blue']}
                    />}
                renderItem={({ item }) => {
                    return (
                        <>
                            <TouchableOpacity style={{
                                width: "47%", height: 210, backgroundColor: "gray", marginRight: 18,
                                marginBottom: 18, elevation: 3, borderRadius: 7,
                            }}>
                                <Image style={{
                                    width: "100%", height: "100%", borderRadius: 7,
                                }} source={{ uri: "https://image.tmdb.org/t/p/w500" + item.poster_path }} />
                                <View style={{
                                    backgroundColor: "black", width: "100%", height: 50, position: "absolute",
                                    bottom: 0, opacity: 0.2,
                                }}>
                                </View>
                                <Text style={{
                                    position: "absolute", bottom: 30, left: 10, color: "white",
                                    width: 120, fontSize: 13, fontWeight: "300"
                                }}>{formatDate(item.release_date)}</Text>
                                <Text style={{
                                    position: "absolute", bottom: 10, left: 10, color: "white",
                                    fontWeight: "600", width: 120, fontSize: 13
                                }}>{formatTitle(item.title)}</Text>

                                <View style={{
                                    position: "absolute",
                                    width: 30, height: 30, backgroundColor: "#ea693e", right: 10, top: 10,
                                    borderRadius: 15, elevation: 2, justifyContent: "center", alignItems: "center"
                                }}>
                                    <Text style={{
                                        color: "white", fontWeight: "bold"
                                    }}>{item.vote_average}</Text>
                                </View>
                            </TouchableOpacity>

                        </>
                    )
                }}
            />

            {/* Loading */}
            {loadingMore && (
                <View style={{ alignItems: 'center', marginBottom: 20, }}>
                    <ActivityIndicator size="large" color="blue" />
                </View>
            )}

        </View>
    )
}

export default App;