module.exports = {
    getDates: () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        
        const monthStart = `${year}-${month < 10 ? '0' : ''}${month}-01`;

        const lastDay = new Date(year, month, 0).getDate();
        const monthEnd = `${year}-${month < 10 ? '0' : ''}${month}-${lastDay}`;

        return { startDate: monthStart, endDate: monthEnd };
    }
};