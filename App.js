import React, { useEffect, useState } from 'react';
import {StyleSheet,Text,View,FlatList,ActivityIndicator,TouchableOpacity,Alert,StatusBar} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';

export default function App() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {

        setLoading(true);

        const apiUrl = 'http://10.243.211.83:8000/api/get-delivery-details';

        axios.get(apiUrl)
            .then(response => {

                if (response.data.success) {
                    setOrders(response.data.data);
                }

                setLoading(false);

            })
            .catch(error => {

                console.error("API Error: ", error);
                setLoading(false);

            });
    };

    const handleDeliverOrder = (orderId) => {

        const apiUrl = `http://10.243.211.83:8000/api/set-update-delivery-status/${orderId}`;

        axios.put(apiUrl)
            .then(response => {

                if (response.status === 200) {

                    Alert.alert("Success", "Order marked as delivered!");

                    fetchOrders();
                }

            })
            .catch(error => {

                console.error("Delivery Update Error: ", error);

                if (error.response) {

                    Alert.alert("Error", error.response.data.message || "Something went wrong");

                } else {

                    Alert.alert("Error", "Could not connect to server");
                }

            });
    };

    const showConfirmationAlert = (orderId) => {

        Alert.alert(
            "Confirm Delivery",
            "Are you sure this order is delivered?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => handleDeliverOrder(orderId)
                }
            ]
        );
    };

    if (loading) {

        return (
            <View style={styles.loaderContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.loadingText}>Loading Orders...</Text>
            </View>
        );
    }

    return (

        <SafeAreaView style={styles.container}>

            <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />

            
            <View style={styles.headerContainer}>

                <View>
                    <Text style={styles.mainTitle}>Delivery Orders</Text>
                    <Text style={styles.subTitle}>
                        Manage all pending deliveries
                    </Text>
                </View>

                <View style={styles.orderCountBox}>
                    <Text style={styles.orderCount}>{orders.length}</Text>
                </View>

            </View>

            
            {orders.length === 0 ? (

                <View style={styles.emptyContainer}>

                    <FontAwesome
                        name="dropbox"
                        size={60}
                        color="#cbd5e1"
                    />

                    <Text style={styles.emptyTitle}>
                        No Pending Orders
                    </Text>

                    <Text style={styles.emptySubTitle}>
                        All deliveries are completed
                    </Text>

                </View>

            ) : (

                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 20
                    }}
                    renderItem={({ item }) => (

                        <View style={styles.card}>

                            {/* TOP */}
                            <View style={styles.cardTop}>

                                <View>
                                    <Text style={styles.orderNumber}>
                                        Order #{item.id}
                                    </Text>

                                    <Text style={styles.dateText}>
                                        Delivery Order
                                    </Text>
                                </View>

                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>
                                        {item.order_status
                                            ? item.order_status
                                            : 'pending'}
                                    </Text>
                                </View>

                            </View>

                            {/* CUSTOMER */}
                            <View style={styles.infoSection}>

                                <View style={styles.infoRow}>

                                    <View style={styles.iconContainer}>
                                        <FontAwesome
                                            name="user"
                                            size={16}
                                            color="#2563eb"
                                        />
                                    </View>

                                    <View style={styles.infoTextContainer}>
                                        <Text style={styles.label}>
                                            Customer
                                        </Text>

                                        <Text style={styles.value}>
                                            {item.customer_name
                                                ? item.customer_name
                                                : 'N/A'}
                                        </Text>
                                    </View>

                                </View>

                                <View style={styles.infoRow}>

                                    <View style={styles.iconContainer}>
                                        <FontAwesome
                                            name="phone"
                                            size={16}
                                            color="#16a34a"
                                        />
                                    </View>

                                    <View style={styles.infoTextContainer}>
                                        <Text style={styles.label}>
                                            Phone
                                        </Text>

                                        <Text style={styles.value}>
                                            {item.customer_phone
                                                ? item.customer_phone
                                                : 'N/A'}
                                        </Text>
                                    </View>

                                </View>

                                <View style={styles.infoRow}>

                                    <View style={styles.iconContainer}>
                                        <FontAwesome
                                            name="map-marker"
                                            size={18}
                                            color="#dc2626"
                                        />
                                    </View>

                                    <View style={styles.infoTextContainer}>
                                        <Text style={styles.label}>
                                            Address
                                        </Text>

                                        <Text style={styles.addressText}>
                                            {item.customer_address
                                                ? item.customer_address
                                                : 'N/A'}
                                        </Text>
                                    </View>

                                </View>

                            </View>

                            {/* AMOUNT */}
                            <View style={styles.amountContainer}>

                                <Text style={styles.amountLabel}>
                                    Total Amount
                                </Text>

                                <Text style={styles.amountValue}>
                                    LKR {item.total_amount}
                                </Text>

                            </View>

                            {/* BUTTON */}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.button}
                                onPress={() => showConfirmationAlert(item.id)}
                            >

                                <FontAwesome
                                    name="check"
                                    size={16}
                                    color="#fff"
                                />

                                <Text style={styles.buttonText}>
                                    Mark as Delivered
                                </Text>

                            </TouchableOpacity>

                        </View>
                    )}
                />
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 18,
        paddingTop: 10,
    },

    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
    },

    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: '#64748b',
        fontWeight: '600',
    },

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 22,
    },

    mainTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#0f172a',
    },

    subTitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },

    orderCountBox: {
        width: 55,
        height: 55,
        borderRadius: 18,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },

    orderCount: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },

    card: {
        backgroundColor: '#ffffff',
        borderRadius: 22,
        padding: 18,
        marginBottom: 18,
        elevation: 4,
    },

    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },

    orderNumber: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#0f172a',
    },

    dateText: {
        marginTop: 4,
        color: '#94a3b8',
        fontSize: 13,
    },

    statusBadge: {
        backgroundColor: '#fef3c7',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 30,
    },

    statusText: {
        color: '#d97706',
        fontWeight: 'bold',
        textTransform: 'capitalize',
        fontSize: 13,
    },

    infoSection: {
        marginBottom: 18,
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },

    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    infoTextContainer: {
        flex: 1,
    },

    label: {
        fontSize: 13,
        color: '#94a3b8',
        marginBottom: 3,
        fontWeight: '600',
    },

    value: {
        fontSize: 16,
        color: '#0f172a',
        fontWeight: '600',
    },

    addressText: {
        fontSize: 15,
        color: '#334155',
        lineHeight: 22,
        fontWeight: '500',
    },

    amountContainer: {
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 16,
        marginBottom: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    amountLabel: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '600',
    },

    amountValue: {
        color: '#16a34a',
        fontSize: 20,
        fontWeight: 'bold',
    },

    button: {
        backgroundColor: '#2563eb',
        height: 54,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyTitle: {
        marginTop: 18,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#334155',
    },

    emptySubTitle: {
        marginTop: 6,
        fontSize: 15,
        color: '#94a3b8',
    },

});