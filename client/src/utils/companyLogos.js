// Map of company names to their logo URLs
const companyLogos = {
  // Tech Giants
  'Apple': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  'Microsoft': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  'Amazon': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'Google': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  'Facebook': 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
  'Tesla': 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
  'Walmart': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg',
  'JPMorgan Chase': 'https://upload.wikimedia.org/wikipedia/commons/a/af/J_P_Morgan_Logo_2008_1.svg',
  'Netflix': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
  'IBM': 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
  'Adobe': 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Adobe_Inc._logo.svg',
  
  // More Tech Companies
  'Alphabet': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', // Google parent
  'Meta': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', // Facebook parent
  'Intel': 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg',
  'Cisco': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg',
  'Oracle': 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
  'Samsung': 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
  'Sony': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg',
  'Tencent': 'https://upload.wikimedia.org/wikipedia/commons/2/22/Tencent_Logo.svg',
  'Alibaba': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Alibaba_Group_logo.svg',
  'Salesforce': 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
  'SAP': 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg',
  'NVIDIA': 'https://upload.wikimedia.org/wikipedia/en/2/2f/Nvidia_logo.svg',
  'AMD': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg',
  'Dell': 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg',
  'HP': 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg',
  'Lenovo': 'https://upload.wikimedia.org/wikipedia/commons/8/85/Lenovo_logo.svg',
  'Twitter': 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
  'LinkedIn': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
  'Zoom': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg',
  'Spotify': 'https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg',
  
  // Retail & Consumer Goods
  'Target': 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Target_Corporation_logo_%28vector%29.svg',
  'Costco': 'https://upload.wikimedia.org/wikipedia/commons/5/59/Costco_Wholesale_logo_2010-10-26.svg',
  'Home Depot': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/TheHomeDepot.svg',
  'Lowe\'s': 'https://upload.wikimedia.org/wikipedia/commons/3/31/Lowe%27s_Companies_Logo.svg',
  'Kroger': 'https://upload.wikimedia.org/wikipedia/commons/6/69/Kroger_logo.svg',
  'Best Buy': 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg',
  'Nike': 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
  'Adidas': 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
  'Coca-Cola': 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg',
  'PepsiCo': 'https://upload.wikimedia.org/wikipedia/commons/6/68/Pepsi_logo_new.svg',
  'Procter & Gamble': 'https://upload.wikimedia.org/wikipedia/commons/8/85/Procter_%26_Gamble_logo.svg',
  'Unilever': 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Unilever_logo.svg',
  'Nestlé': 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Nestle_logo.svg',
  'McDonald\'s': 'https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg',
  'Starbucks': 'https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg',
  
  // Financial Services
  'Visa': 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
  'Mastercard': 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
  'American Express': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg',
  'Bank of America': 'https://upload.wikimedia.org/wikipedia/commons/2/20/Bank_of_America_logo.svg',
  'Wells Fargo': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Wells_Fargo_Bank.svg',
  'Citigroup': 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Citigroup_logo.svg',
  'Goldman Sachs': 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg',
  'Morgan Stanley': 'https://upload.wikimedia.org/wikipedia/commons/3/34/Morgan_Stanley_Logo.svg',
  'HSBC': 'https://upload.wikimedia.org/wikipedia/commons/a/aa/HSBC_logo.svg',
  'Barclays': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Barclays_logo.svg',
  'Royal Bank of Canada': 'https://upload.wikimedia.org/wikipedia/commons/c/cf/RBC_Royal_Bank.svg',
  'UBS': 'https://upload.wikimedia.org/wikipedia/commons/7/73/UBS_Logo.svg',
  'BlackRock': 'https://upload.wikimedia.org/wikipedia/commons/a/aa/BlackRock_wordmark.svg',
  'PayPal': 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
  'Square': 'https://upload.wikimedia.org/wikipedia/commons/3/30/Square%2C_Inc._-_Square_logo.svg',
  
  // Automotive
  'Toyota': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg',
  'Volkswagen': 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg',
  'General Motors': 'https://upload.wikimedia.org/wikipedia/commons/9/99/General_Motors_logo.svg',
  'Ford': 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Ford_Motor_Company_Logo.svg',
  'Honda': 'https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg',
  'BMW': 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
  'Mercedes-Benz': 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg',
  'Hyundai': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Hyundai_Motor_Company_logo.svg',
  
  // Energy & Industrial
  'ExxonMobil': 'https://upload.wikimedia.org/wikipedia/commons/c/c2/ExxonMobil_Logo.svg',
  'Shell': 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Shell_logo.svg',
  'Chevron': 'https://upload.wikimedia.org/wikipedia/commons/8/86/Chevron_Corporation_logo.svg',
  'BP': 'https://upload.wikimedia.org/wikipedia/commons/0/0c/BP_logo.svg',
  'Total': 'https://upload.wikimedia.org/wikipedia/commons/4/46/TotalEnergies_logo.svg',
  'General Electric': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/General_Electric_logo.svg',
  'Siemens': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Siemens-logo.svg',
  '3M': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/3M_wordmark.svg',
  
  // Healthcare & Pharma
  'Johnson & Johnson': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Johnson_%26_Johnson_Logo.svg',
  'Pfizer': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Pfizer_%282021%29.svg',
  'Roche': 'https://upload.wikimedia.org/wikipedia/commons/9/91/Roche_Logo.svg',
  'Novartis': 'https://upload.wikimedia.org/wikipedia/commons/7/79/Novartis_logo.svg',
  'Merck': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Merck_%26_Co.svg',
  'Bayer': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Bayer_Logo.svg',
  'UnitedHealth Group': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/UnitedHealth_Group_Incorporated_logo.svg',
  'CVS Health': 'https://upload.wikimedia.org/wikipedia/commons/3/33/Logo_CVS_Health.svg',
  
  // Telecommunications
  'AT&T': 'https://upload.wikimedia.org/wikipedia/commons/c/cf/AT%26T_logo_2016.svg',
  'Verizon': 'https://upload.wikimedia.org/wikipedia/commons/7/77/Verizon_Media_Logo.svg',
  'T-Mobile': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/T-Mobile_logo.svg',
  'Comcast': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Comcast_Logo.svg',
  'Vodafone': 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Vodafone_2017_logo.svg',
  
  // Entertainment & Media
  'Disney': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
  'Warner Bros.': 'https://upload.wikimedia.org/wikipedia/commons/6/64/Warner_Bros_logo.svg',
  'Universal': 'https://upload.wikimedia.org/wikipedia/commons/9/93/Universal_Pictures_Logo.svg',
  'Paramount': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Paramount_Pictures_logo_with_new_Viacom.svg',
  'Sony Pictures': 'https://upload.wikimedia.org/wikipedia/commons/6/63/Sony_Pictures_Television_logo.svg',
};

// Function to get logo URL for a company
export const getCompanyLogo = (companyName) => {
  if (!companyName) return null;
  
  // Check for exact match
  if (companyLogos[companyName]) {
    return companyLogos[companyName];
  }
  
  // Check for partial matches (e.g., "Microsoft Corp" should match "Microsoft")
  const matchingCompany = Object.keys(companyLogos).find(company => 
    companyName.toLowerCase().includes(company.toLowerCase()));
  
  return matchingCompany ? companyLogos[matchingCompany] : null;
};

export default companyLogos;
