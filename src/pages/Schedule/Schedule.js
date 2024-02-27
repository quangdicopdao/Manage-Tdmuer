import MyCalendar from '~/components/Calendar';
import { createInstance } from '~/utils/createInstance';
function Schedule() {
    let axiosJWT = createInstance();
    return <MyCalendar axiosJWT={axiosJWT} />;
}

export default Schedule;
