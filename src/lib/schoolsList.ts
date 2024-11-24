export const defaultSchools = [
  'ابتدائية بوعشرية امحمد',
  'ابتدائية خداوي محمد',
  'ابتدائية بن اعمير سليمان',
  'ابتدائية بوبكري محمد',
  'ابتدائية بوشي امحمد',
  'ابتدائية بوشريط',
  'ابتدائية الآمال',
  'ابتدائية ابن خلدون',
  'ابتدائية حميدي بولنوار',
  'ابتدائية مولود فرعون',
  'ابتدائية جبارة البشير',
  'ابتدائية الراجع الشيخ',
  'ابتدائية لعمارة مولود',
  'ابتدائية العقيد لطفي',
  'ابتدائية ايدو عبد الرحمان',
  'ابتدائية عرض الله احمد',
  'ابتدائية قسم الكرابو',
  'ابتدائية خالفي قويدر',
  'ابتدائية بوشي الحاج',
  'ابتدائية ربيعي الميلود',
  'ابتدائية بومهراز بلقاسم',
  'ابتدائية بلحية بوعلام',
  'ابتدائية بلخير محمد عبد الحق بن حمودة',
  'ابتدائية الاخوة بوقاسم',
  'ابتدائية الزش احمد',
  'ابتدائية عبة بحوص',
  'ابتدائية شيحة بن عودة',
  'ابتدائية بالسايح عبد القادر',
  'ابتدائية بن ديدة الشيخ',
  'ابتدائية مصطفاوي محمد',
  'ابتدائية مناد عبد السلام',
  'ابتدائية النجاح',
  'ابتدائية بودلال محمد',
  'ابتدائية طبوش محمد',
  'ابتدائية رمضاني الجيلالي',
  'ابتدائية رزازقي بوعلام',
  'ابتدائية رحيم عبد القادر',
  'ابتدائية نور الطاهر',
  'ابتدائية ديداني احمد',
  'ابتدائية الاخوة بوشنافة',
  'ابتدائية بوخبزة الشيخ',
  'ابتدائية الفتح',
  'ابتدائية صالحي عامر',
  'ابتدائية اوليسيس محمد',
  'ابتدائية محند عامر حمزة',
  'ابتدائية بلمغربي محمد',
  'ابتدائية بوعزة محمد',
  'ابتدائية مول الخلوة الحوض',
  'ابتدائية وذني محمد'
].sort();

export const getSchools = () => {
  // Get any custom schools from storage
  const customSchools = localStorage.getItem('custom-schools');
  const additionalSchools = customSchools ? JSON.parse(customSchools) : [];
  
  // Combine and sort all schools
  return [...defaultSchools, ...additionalSchools].sort();
};

export const addCustomSchool = (schoolName: string) => {
  const customSchools = localStorage.getItem('custom-schools');
  const schools = customSchools ? JSON.parse(customSchools) : [];
  
  if (!schools.includes(schoolName) && !defaultSchools.includes(schoolName)) {
    schools.push(schoolName);
    localStorage.setItem('custom-schools', JSON.stringify(schools));
  }
}; 