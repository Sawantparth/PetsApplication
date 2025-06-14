import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { useApp, Community, Post, CommunityEvent } from '../contexts/AppContext'; // Ensure Post, CommunityEvent are exported
// Note: For a real app, DateTimePicker should be used for date/time input.
// import DateTimePicker from '@react-native-community/datetimepicker';


const CommunityScreen = () => {
  const {
    communities, createCommunity, joinCommunity, leaveCommunity,
    currentUser,
    addPostToCommunity, addCommentToPost,
    communityEvents, createCommunityEvent, joinEvent, leaveEvent
  } = useApp();

  // Community creation state
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDesc, setNewCommunityDesc] = useState('');
  const [newCommunityType, setNewCommunityType] = useState<'dog' | 'cat' | 'topic' | 'interest' | 'other'>('topic');

  // Selected community state
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

  // Post creation state
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMediaUrl, setNewPostMediaUrl] = useState('');

  // Comment creation state
  const [newCommentContent, setNewCommentContent] = useState('');
  const [commentingOnPostId, setCommentingOnPostId] = useState<string | null>(null);

  // Event creation state
  const [newEventName, setNewEventName] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDate, setNewEventDate] = useState(''); // Store as string for simplicity, ideally Date object
  const [showEventForm, setShowEventForm] = useState(false);

  // Selected Event State
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);


  const handleCreateCommunity = () => {
    if (!currentUser) { Alert.alert("Error", "Login to create."); return; }
    if (!newCommunityName.trim() || !newCommunityDesc.trim()) { Alert.alert("Error", "Name and description are required."); return; }
    createCommunity({ name: newCommunityName, description: newCommunityDesc, type: newCommunityType });
    setNewCommunityName(''); setNewCommunityDesc(''); setNewCommunityType('topic');
  };

  const handleJoinLeaveCommunity = (community: Community) => {
    if (!currentUser) { Alert.alert("Error", "Login to join/leave."); return; }
    const isMember = community.memberIds.includes(currentUser.id);
    if (isMember) leaveCommunity(community.id, currentUser.id);
    else joinCommunity(community.id, currentUser.id);
  };

  const handleCreatePost = () => {
    if (!currentUser || !selectedCommunity) { Alert.alert("Error", "Login and select a community."); return; }
    if (!newPostContent.trim()) { Alert.alert("Error", "Post content required."); return; }
    addPostToCommunity(selectedCommunity.id, { content: newPostContent, mediaUrl: newPostMediaUrl.trim() || undefined });
    setNewPostContent(''); setNewPostMediaUrl('');
    const updatedCommunity = communities.find(c => c.id === selectedCommunity.id);
    if (updatedCommunity) setSelectedCommunity(updatedCommunity);
  };

  const handleAddComment = (postId: string) => {
    if (!currentUser || !selectedCommunity) { Alert.alert("Error", "Login and select community."); return; }
    if (!newCommentContent.trim()) { Alert.alert("Error", "Comment content required."); return; }
    addCommentToPost(postId, { content: newCommentContent });
    setNewCommentContent(''); setCommentingOnPostId(null);
    const updatedCommunity = communities.find(c => c.id === selectedCommunity.id);
    if (updatedCommunity) setSelectedCommunity(updatedCommunity);
  };

  const handleCreateEvent = () => {
    if (!currentUser || !selectedCommunity) { Alert.alert("Error", "Login and select a community to create an event."); return; }
    if (!newEventName.trim() || !newEventDesc.trim() || !newEventLocation.trim() || !newEventDate.trim()) {
      Alert.alert("Error", "All event fields are required."); return;
    }
    // Basic date parsing, in a real app, use a date picker and proper Date objects
    const parsedDate = new Date(newEventDate);
    if (isNaN(parsedDate.getTime())) {
      Alert.alert("Error", "Invalid date format. Please use YYYY-MM-DD or a valid date string."); return;
    }
    createCommunityEvent({
      communityId: selectedCommunity.id,
      name: newEventName,
      description: newEventDesc,
      location: newEventLocation,
      dateTime: parsedDate,
    });
    setNewEventName(''); setNewEventDesc(''); setNewEventLocation(''); setNewEventDate(''); setShowEventForm(false);
  };

  const handleRsvp = (event: CommunityEvent) => {
    if (!currentUser) { Alert.alert("Error", "Login to RSVP."); return; }
    const isAttending = event.attendees.includes(currentUser.id);
    if (isAttending) {
      leaveEvent(event.id, currentUser.id);
    } else {
      joinEvent(event.id, currentUser.id);
    }
    // Refresh selected event if it's the one being modified
    if (selectedEvent?.id === event.id) {
        const updatedEvent = communityEvents.find(e => e.id === event.id);
        setSelectedEvent(updatedEvent || null);
    }
  };

  const getCommunityNameById = (communityId: string) => {
    const community = communities.find(c => c.id === communityId);
    return community ? community.name : "Unknown Community";
  };

  // RENDER ITEMS
  const renderCommunityItem = ({ item }: { item: Community }) => {
    const isMember = currentUser ? item.memberIds.includes(currentUser.id) : false;
    return (
      <TouchableOpacity onPress={() => {setSelectedCommunity(item); setSelectedEvent(null);}} style={styles.communityItem}>
        <Text style={styles.communityName}>{item.name}</Text>
        <Text style={styles.communityDesc}>{item.description}</Text>
        <Text style={styles.communityType}>Type: {item.type} | Members: {item.memberIds.length}</Text>
        {currentUser && (
          <TouchableOpacity
            style={[styles.joinLeaveButton, isMember ? styles.leaveButton : styles.joinButton]}
            onPress={(e) => { e.stopPropagation(); handleJoinLeaveCommunity(item);}}
          >
            <Text style={styles.joinLeaveButtonText}>{isMember ? 'Leave' : 'Join'}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderPostItem = ({ item }: { item: Post }) => {
    const isMemberOfSelectedCommunity = selectedCommunity && currentUser ? selectedCommunity.memberIds.includes(currentUser.id) : false;
    return (
      <View style={styles.postItem}>
        <Text style={styles.postAuthor}>Author ID: {item.authorId} | Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
        <Text style={styles.postContent}>{item.content}</Text>
        {item.mediaUrl && <Text style={styles.postMedia}>Media: {item.mediaUrl}</Text>}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsHeader}>Comments ({item.comments.length}):</Text>
          {item.comments.map(comment => ( // Changed to map for ScrollView compatibility
            <View key={comment.id} style={styles.commentItem}>
              <Text style={styles.commentAuthor}>Author ID: {comment.authorId} | {new Date(comment.createdAt).toLocaleDateString()}</Text>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
          ))}
          {isMemberOfSelectedCommunity && (
            <View style={styles.addCommentContainer}>
              {commentingOnPostId === item.id ? (
                <>
                  <TextInput style={styles.input} placeholder="Write a comment..." value={newCommentContent} onChangeText={setNewCommentContent} multiline/>
                  <View style={styles.buttonRow}>
                    <Button title="Submit Comment" onPress={() => handleAddComment(item.id)} />
                    <Button title="Cancel" onPress={() => {setCommentingOnPostId(null); setNewCommentContent('');}} />
                  </View>
                </>
              ) : ( <Button title="Add Comment" onPress={() => {setCommentingOnPostId(item.id); setNewCommentContent('');}} /> )}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderEventItem = ({ item }: { item: CommunityEvent }) => {
    const isAttending = currentUser ? item.attendees.includes(currentUser.id) : false;
    return (
      <TouchableOpacity style={styles.eventItem} onPress={() => setSelectedEvent(item)}>
        <Text style={styles.eventName}>{item.name}</Text>
        <Text style={styles.eventCommunity}>Community: {getCommunityNameById(item.communityId)}</Text>
        <Text style={styles.eventDateTime}>When: {new Date(item.dateTime).toLocaleString()}</Text>
        <Text style={styles.eventLocation}>Where: {item.location}</Text>
        <Text style={styles.eventAttendees}>Attendees: {item.attendees.length}</Text>
        {currentUser && (
          <TouchableOpacity
            style={[styles.rsvpButton, isAttending ? styles.leaveButton : styles.joinButton]}
            onPress={(e) => { e.stopPropagation(); handleRsvp(item); }}
          >
            <Text style={styles.joinLeaveButtonText}>{isAttending ? 'Cancel RSVP' : 'RSVP'}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  // SCREEN VIEWS
  if (selectedEvent && !selectedCommunity) { // Viewing a specific event from the general list
    const currentSelectedEventState = communityEvents.find(e => e.id === selectedEvent.id) || selectedEvent;
    const isAttending = currentUser ? currentSelectedEventState.attendees.includes(currentUser.id) : false;
    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => setSelectedEvent(null)} style={styles.backButton}>
              <Text style={styles.backButtonText}>&lt; Back to All Events / Communities</Text>
            </TouchableOpacity>
            <Text style={styles.header}>{currentSelectedEventState.name}</Text>
            <Text style={styles.eventCommunity}>Community: {getCommunityNameById(currentSelectedEventState.communityId)}</Text>
            <Text style={styles.eventDesc}>Description: {currentSelectedEventState.description}</Text>
            <Text style={styles.eventDateTime}>When: {new Date(currentSelectedEventState.dateTime).toLocaleString()}</Text>
            <Text style={styles.eventLocation}>Where: {currentSelectedEventState.location}</Text>
            <Text style={styles.sectionTitle}>Attendees ({currentSelectedEventState.attendees.length})</Text>
            {currentSelectedEventState.attendees.map(attendeeId => <Text key={attendeeId}>- User ID: {attendeeId}</Text>)}
            {currentUser && (
              <TouchableOpacity
                style={[styles.rsvpButtonFull, isAttending ? styles.leaveButton : styles.joinButton, {marginTop:10}]}
                onPress={() => handleRsvp(currentSelectedEventState)}
              >
                <Text style={styles.joinLeaveButtonText}>{isAttending ? 'Cancel RSVP' : 'RSVP'}</Text>
              </TouchableOpacity>
            )}
        </ScrollView>
    );
  }

  if (selectedCommunity) {
    const currentSelectedCommunityState = communities.find(c => c.id === selectedCommunity.id) || selectedCommunity;
    const isMemberOfSelectedCommunity = currentUser ? currentSelectedCommunityState.memberIds.includes(currentUser.id) : false;
    const eventsForThisCommunity = communityEvents.filter(event => event.communityId === selectedCommunity.id);

    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => {setSelectedCommunity(null); setShowEventForm(false);}} style={styles.backButton}>
          <Text style={styles.backButtonText}>&lt; Back to Communities List</Text>
        </TouchableOpacity>
        <Text style={styles.header}>{currentSelectedCommunityState.name}</Text>
        <Text style={styles.communityDescFull}>{currentSelectedCommunityState.description}</Text>

        {/* Events for this community */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Events in {currentSelectedCommunityState.name} ({eventsForThisCommunity.length})</Text>
            {isMemberOfSelectedCommunity && !showEventForm && (<Button title="Create New Event for this Community" onPress={() => setShowEventForm(true)} />)}
            {showEventForm && isMemberOfSelectedCommunity && (
                <View style={styles.createEventForm}>
                    <TextInput style={styles.input} placeholder="Event Name" value={newEventName} onChangeText={setNewEventName} />
                    <TextInput style={styles.input} placeholder="Event Description" value={newEventDesc} onChangeText={setNewEventDesc} multiline />
                    <TextInput style={styles.input} placeholder="Location" value={newEventLocation} onChangeText={setNewEventLocation} />
                    <TextInput style={styles.input} placeholder="Date (e.g., YYYY-MM-DD HH:MM)" value={newEventDate} onChangeText={setNewEventDate} />
                     {/* Basic Date Input. Consider using DateTimePicker for better UX */}
                    <View style={styles.buttonRow}>
                        <Button title="Submit Event" onPress={handleCreateEvent} />
                        <Button title="Cancel" onPress={() => setShowEventForm(false)} />
                    </View>
                </View>
            )}
            {eventsForThisCommunity.length === 0 ? <Text>No events scheduled for this community yet.</Text> :
                eventsForThisCommunity.map(event => renderEventItem({item: event})) // Using map for ScrollView
            }
        </View>

        {/* Posts for this community */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Posts in {currentSelectedCommunityState.name} ({currentSelectedCommunityState.posts.length})</Text>
            {isMemberOfSelectedCommunity && (
            <View style={styles.createPostSection}>
                <TextInput style={styles.input} placeholder="What's on your mind?" value={newPostContent} onChangeText={setNewPostContent} multiline/>
                <TextInput style={styles.input} placeholder="Media URL (optional)" value={newPostMediaUrl} onChangeText={setNewPostMediaUrl}/>
                <Button title="Create Post" onPress={handleCreatePost} />
            </View>
            )}
            {currentSelectedCommunityState.posts.length === 0 ? <Text>No posts in this community yet.</Text> :
            currentSelectedCommunityState.posts.map(post => renderPostItem({item: post})) // Using map for ScrollView
            }
        </View>
      </ScrollView>
    );
  }

  // Main Screen (List of Communities and All Events)
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Welcome to Pet Communities!</Text>
      <View style={styles.createCommunitySection}>
        <Text style={styles.sectionTitle}>Create New Community</Text>
        <TextInput style={styles.input} placeholder="Community Name" value={newCommunityName} onChangeText={setNewCommunityName}/>
        <TextInput style={styles.input} placeholder="Community Description" value={newCommunityDesc} onChangeText={setNewCommunityDesc}/>
        <View style={styles.typeSelector}>
          <Text>Type: </Text>
          {['dog', 'cat', 'topic', 'interest', 'other'].map(type => (
            <TouchableOpacity key={type} onPress={() => setNewCommunityType(type as any)} style={[styles.typeButton, newCommunityType === type && styles.typeButtonSelected]}><Text>{type.charAt(0).toUpperCase() + type.slice(1)}</Text></TouchableOpacity>
          ))}
        </View>
        <Button title="Create Community" onPress={handleCreateCommunity} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Upcoming Events ({communityEvents.length})</Text>
        {communityEvents.length === 0 ? <Text>No events scheduled yet.</Text> :
            <FlatList data={communityEvents} renderItem={renderEventItem} keyExtractor={(item) => item.id} />
        }
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explore Communities ({communities.length})</Text>
        {communities.length === 0 ? <Text>No communities yet. Why not create one?</Text> : (
          <FlatList data={communities} renderItem={renderCommunityItem} keyExtractor={(item) => item.id}/>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f2f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#333' },
  section: { marginBottom: 20, backgroundColor: '#fff', padding:15, borderRadius:8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3},
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#444' },
  createCommunitySection: { marginBottom: 20, padding: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 4, backgroundColor: '#fff' },
  communityItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 8, backgroundColor: '#f9f9f9', borderRadius: 5 },
  communityName: { fontSize: 17, fontWeight: '600', color: '#007bff' },
  communityDesc: { fontSize: 14, color: '#555', marginTop: 4 },
  communityDescFull: { fontSize: 15, color: '#454545', marginBottom:15, lineHeight:20},
  communityType: { fontSize: 12, color: '#777', marginTop: 4, marginBottom: 8 },
  joinLeaveButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, alignItems: 'center', marginTop: 5, width: 100 },
  joinButton: { backgroundColor: '#28a745' }, // Green
  leaveButton: { backgroundColor: '#dc3545' }, // Red
  joinLeaveButtonText: { color: 'white', fontWeight: 'bold' },
  typeSelector: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' },
  typeButton: { padding: 8, borderWidth: 1, borderColor: '#ccc', marginLeft: 5, marginBottom: 5, borderRadius: 4 },
  typeButtonSelected: { backgroundColor: '#e0e0e0', borderColor: '#007bff' },
  backButton: { marginBottom: 15, paddingVertical: 8, alignSelf:'flex-start'},
  backButtonText: { color: '#007bff', fontSize: 16, fontWeight:'500' },
  createPostSection: { padding:10, borderWidth:1, borderColor:'#e0e0e0', borderRadius:5, marginBottom:20, backgroundColor:'#f9f9f9'},
  postItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', marginBottom:10, backgroundColor: '#fff', borderRadius: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.18, shadowRadius: 1.00, elevation: 1},
  postAuthor: { fontSize: 12, color: '#888' },
  postContent: { fontSize: 15, marginTop: 4, color: '#333', lineHeight:20 },
  postMedia: { fontSize: 13, color: 'blue', marginTop: 4, textDecorationLine:'underline' },
  commentsSection: { marginTop: 10, paddingLeft: 10, borderLeftWidth: 3, borderLeftColor: '#eef' },
  commentsHeader: { fontSize: 14, fontWeight: '600', marginBottom: 5, color: '#555' },
  commentItem: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f7f7f7' },
  commentAuthor: { fontSize: 11, color: '#777' },
  commentContent: { fontSize: 13, color: '#444' },
  addCommentContainer: { marginTop: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 },
  // Event Styles
  eventItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 8, backgroundColor: '#fff', borderRadius: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.18, shadowRadius: 1.00, elevation: 1},
  eventName: { fontSize: 17, fontWeight: '600', color: '#5cb85c' }, // Greenish for events
  eventCommunity: { fontSize: 12, color: '#777', fontStyle:'italic' },
  eventDateTime: { fontSize: 13, color: '#333', marginVertical:2 },
  eventLocation: { fontSize: 13, color: '#555' },
  eventDesc: { fontSize: 14, color: '#454545', marginVertical:5, lineHeight:19},
  eventAttendees: { fontSize: 12, color: '#777', marginTop: 4, marginBottom: 8 },
  createEventForm: { padding: 15, borderWidth: 1, borderColor: '#d6d6d6', borderRadius: 5, marginBottom: 15, backgroundColor: '#fdfdfd' },
  rsvpButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 5, alignItems: 'center', marginTop: 5, width: 120 },
  rsvpButtonFull: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5, alignItems: 'center'},
});

export default CommunityScreen;
