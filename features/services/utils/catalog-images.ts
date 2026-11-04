import type { ImageProps } from "expo-image";

// Явные require включают изображения без потерь; ключи категорий сохранены для совместимости.
export const catalogImages: Record<string, ImageProps["source"]> = {
  "food-groceries.png": require(
    "@/assets/imgs/catalog/food-groceries.webp"
  ),
  "home-repair.png": require(
    "@/assets/imgs/catalog/home-repair.webp"
  ),
  "cleaning-household.png": require(
    "@/assets/imgs/catalog/cleaning-household.webp"
  ),
  "furniture-interior.png": require(
    "@/assets/imgs/catalog/furniture-interior.webp"
  ),
  "electronics.png": require(
    "@/assets/imgs/catalog/electronics.webp"
  ),
  "auto.png": require(
    "@/assets/imgs/catalog/auto.webp"
  ),
  "beauty-care.png": require(
    "@/assets/imgs/catalog/beauty-care.webp"
  ),
  "health.png": require(
    "@/assets/imgs/catalog/health.webp"
  ),
  "children-family.png": require(
    "@/assets/imgs/catalog/children-family.webp"
  ),
  "education.png": require(
    "@/assets/imgs/catalog/education.webp"
  ),
  "sports.png": require(
    "@/assets/imgs/catalog/sports.webp"
  ),
  "clothing-tailoring.png": require(
    "@/assets/imgs/catalog/clothing-tailoring.webp"
  ),
  "weddings-events.png": require(
    "@/assets/imgs/catalog/weddings-events.webp"
  ),
  "flowers-gifts.png": require(
    "@/assets/imgs/catalog/flowers-gifts.webp"
  ),
  "travel-leisure.png": require(
    "@/assets/imgs/catalog/travel-leisure.webp"
  ),
  "real-estate.png": require(
    "@/assets/imgs/catalog/real-estate.webp"
  ),
  "business-services.png": require(
    "@/assets/imgs/catalog/business-services.webp"
  ),
  "garden-farming.png": require(
    "@/assets/imgs/catalog/garden-farming.webp"
  ),
  "religion-community.png": require(
    "@/assets/imgs/catalog/religion-community.webp"
  ),
  "food-groceries/restaurants-cafes.webp": require(
    "@/assets/imgs/catalog/food-groceries/restaurants-cafes.webp"
  ),
  "food-groceries/prepared-food.webp": require(
    "@/assets/imgs/catalog/food-groceries/prepared-food.webp"
  ),
  "food-groceries/bakeries-cakes.webp": require(
    "@/assets/imgs/catalog/food-groceries/bakeries-cakes.webp"
  ),
  "food-groceries/grocery-stores-original.webp": require(
    "@/assets/imgs/catalog/food-groceries/grocery-stores-original.webp"
  ),
  "home-repair/plumbing.webp": require(
    "@/assets/imgs/catalog/home-repair/plumbing.webp"
  ),
  "home-repair/electrical-original.webp": require(
    "@/assets/imgs/catalog/home-repair/electrical-original.webp"
  ),
  "home-repair/handyman.webp": require(
    "@/assets/imgs/catalog/home-repair/handyman.webp"
  ),
  "home-repair/renovation.webp": require(
    "@/assets/imgs/catalog/home-repair/renovation.webp"
  ),
  "home-repair/construction.webp": require(
    "@/assets/imgs/catalog/home-repair/construction.webp"
  ),
  "home-repair/heating-water.webp": require(
    "@/assets/imgs/catalog/home-repair/heating-water.webp"
  ),
  "home-repair/air-conditioning.webp": require(
    "@/assets/imgs/catalog/home-repair/air-conditioning.webp"
  ),
  "home-repair/windows-doors.png": require(
    "@/assets/imgs/catalog/home-repair/windows-doors.png"
  ),
  "home-repair/roofing.webp": require(
    "@/assets/imgs/catalog/home-repair/roofing.webp"
  ),
  "home-repair/fences-gates.png": require(
    "@/assets/imgs/catalog/home-repair/fences-gates.png"
  ),
  "cleaning-household/home-cleaning-original.webp": require(
    "@/assets/imgs/catalog/cleaning-household/home-cleaning-original.webp"
  ),
  "cleaning-household/carpet-cleaning.webp": require(
    "@/assets/imgs/catalog/cleaning-household/carpet-cleaning.webp"
  ),
  "cleaning-household/upholstery-cleaning.webp": require(
    "@/assets/imgs/catalog/cleaning-household/upholstery-cleaning.webp"
  ),
  "cleaning-household/dry-cleaning-original.webp": require(
    "@/assets/imgs/catalog/cleaning-household/dry-cleaning-original.webp"
  ),
  "cleaning-household/laundry-ironing.webp": require(
    "@/assets/imgs/catalog/cleaning-household/laundry-ironing.webp"
  ),
  "cleaning-household/pest-control.webp": require(
    "@/assets/imgs/catalog/cleaning-household/pest-control.webp"
  ),
  "furniture-interior/custom-kitchens.webp": require(
    "@/assets/imgs/catalog/furniture-interior/custom-kitchens.webp"
  ),
  "furniture-interior/wardrobes.webp": require(
    "@/assets/imgs/catalog/furniture-interior/wardrobes.webp"
  ),
  "furniture-interior/upholstered-furniture.webp": require(
    "@/assets/imgs/catalog/furniture-interior/upholstered-furniture.webp"
  ),
  "furniture-interior/tables-chairs.webp": require(
    "@/assets/imgs/catalog/furniture-interior/tables-chairs.webp"
  ),
  "furniture-interior/furniture-assembly.webp": require(
    "@/assets/imgs/catalog/furniture-interior/furniture-assembly.webp"
  ),
  "furniture-interior/furniture-repair.webp": require(
    "@/assets/imgs/catalog/furniture-interior/furniture-repair.webp"
  ),
  "furniture-interior/curtains-blinds.webp": require(
    "@/assets/imgs/catalog/furniture-interior/curtains-blinds.webp"
  ),
  "furniture-interior/interior-design.webp": require(
    "@/assets/imgs/catalog/furniture-interior/interior-design.webp"
  ),
  "furniture-interior/lighting.webp": require(
    "@/assets/imgs/catalog/furniture-interior/lighting.webp"
  ),
  "furniture-interior/decor-textiles.webp": require(
    "@/assets/imgs/catalog/furniture-interior/decor-textiles.webp"
  ),
  "electronics/phone-repair.webp": require(
    "@/assets/imgs/catalog/electronics/phone-repair.webp"
  ),
  "electronics/computer-repair.webp": require(
    "@/assets/imgs/catalog/electronics/computer-repair.webp"
  ),
  "electronics/appliance-repair.webp": require(
    "@/assets/imgs/catalog/electronics/appliance-repair.webp"
  ),
  "electronics/appliance-installation.webp": require(
    "@/assets/imgs/catalog/electronics/appliance-installation.webp"
  ),
  "electronics/internet-wifi.webp": require(
    "@/assets/imgs/catalog/electronics/internet-wifi.webp"
  ),
  "electronics/security-intercom.webp": require(
    "@/assets/imgs/catalog/electronics/security-intercom.webp"
  ),
  "electronics/phones-accessories-original.webp": require(
    "@/assets/imgs/catalog/electronics/phones-accessories-original.webp"
  ),
  "electronics/computers-parts.webp": require(
    "@/assets/imgs/catalog/electronics/computers-parts.webp"
  ),
  "electronics/home-appliances.webp": require(
    "@/assets/imgs/catalog/electronics/home-appliances.webp"
  ),
  "auto/maintenance-original.webp": require(
    "@/assets/imgs/catalog/auto/maintenance-original.webp"
  ),
  "auto/diagnostics.webp": require(
    "@/assets/imgs/catalog/auto/diagnostics.webp"
  ),
  "auto/engine-transmission-original.webp": require(
    "@/assets/imgs/catalog/auto/engine-transmission-original.webp"
  ),
  "auto/suspension.webp": require(
    "@/assets/imgs/catalog/auto/suspension.webp"
  ),
  "auto/body-paint.webp": require(
    "@/assets/imgs/catalog/auto/body-paint.webp"
  ),
  "auto/tires-original.webp": require(
    "@/assets/imgs/catalog/auto/tires-original.webp"
  ),
  "auto/detailing-original.webp": require(
    "@/assets/imgs/catalog/auto/detailing-original.webp"
  ),
  "auto/parts-accessories-original.webp": require(
    "@/assets/imgs/catalog/auto/parts-accessories-original.webp"
  ),
  "auto/car-inspection.webp": require(
    "@/assets/imgs/catalog/auto/car-inspection.webp"
  ),
  "auto/car-sales-original.webp": require(
    "@/assets/imgs/catalog/auto/car-sales-original.webp"
  ),
  "auto/mobile-service-original.webp": require(
    "@/assets/imgs/catalog/auto/mobile-service-original.webp"
  ),
  "auto/towing-original.webp": require(
    "@/assets/imgs/catalog/auto/towing-original.webp"
  ),
  "auto/vehicle-documents-original.webp": require(
    "@/assets/imgs/catalog/auto/vehicle-documents-original.webp"
  ),
  "auto/car-installments-original.webp": require(
    "@/assets/imgs/catalog/auto/car-installments-original.webp"
  ),
  "auto/tuning-original.webp": require(
    "@/assets/imgs/catalog/auto/tuning-original.webp"
  ),
  "beauty-care/mens-haircuts-original.webp": require(
    "@/assets/imgs/catalog/beauty-care/mens-haircuts-original.webp"
  ),
  "beauty-care/beard-grooming.webp": require(
    "@/assets/imgs/catalog/beauty-care/beard-grooming.webp"
  ),
  "beauty-care/mens-hair-care.webp": require(
    "@/assets/imgs/catalog/beauty-care/mens-hair-care.webp"
  ),
  "beauty-care/mens-facial-care.webp": require(
    "@/assets/imgs/catalog/beauty-care/mens-facial-care.webp"
  ),
  "beauty-care/womens-haircuts.webp": require(
    "@/assets/imgs/catalog/beauty-care/womens-haircuts.webp"
  ),
  "beauty-care/hair-color-care.webp": require(
    "@/assets/imgs/catalog/beauty-care/hair-color-care.webp"
  ),
  "beauty-care/hairstyling.webp": require(
    "@/assets/imgs/catalog/beauty-care/hairstyling.webp"
  ),
  "beauty-care/makeup.webp": require(
    "@/assets/imgs/catalog/beauty-care/makeup.webp"
  ),
  "beauty-care/nails.webp": require(
    "@/assets/imgs/catalog/beauty-care/nails.webp"
  ),
  "beauty-care/face-body-care.webp": require(
    "@/assets/imgs/catalog/beauty-care/face-body-care.webp"
  ),
  "beauty-care/spa-hammam.webp": require(
    "@/assets/imgs/catalog/beauty-care/spa-hammam.webp"
  ),
  "health/doctors-original.webp": require(
    "@/assets/imgs/catalog/health/doctors-original.webp"
  ),
  "health/dentistry.webp": require(
    "@/assets/imgs/catalog/health/dentistry.webp"
  ),
  "health/lab-tests.webp": require(
    "@/assets/imgs/catalog/health/lab-tests.webp"
  ),
  "health/diagnostics.webp": require(
    "@/assets/imgs/catalog/health/diagnostics.webp"
  ),
  "health/childrens-health.webp": require(
    "@/assets/imgs/catalog/health/childrens-health.webp"
  ),
  "health/eye-care.webp": require(
    "@/assets/imgs/catalog/health/eye-care.webp"
  ),
  "health/rehabilitation.webp": require(
    "@/assets/imgs/catalog/health/rehabilitation.webp"
  ),
  "health/medical-massage.webp": require(
    "@/assets/imgs/catalog/health/medical-massage.webp"
  ),
  "health/psychology.webp": require(
    "@/assets/imgs/catalog/health/psychology.webp"
  ),
  "health/pharmacies-original.webp": require(
    "@/assets/imgs/catalog/health/pharmacies-original.webp"
  ),
  "children-family/nannies.webp": require(
    "@/assets/imgs/catalog/children-family/nannies.webp"
  ),
  "children-family/kindergartens.webp": require(
    "@/assets/imgs/catalog/children-family/kindergartens.webp"
  ),
  "children-family/early-learning.webp": require(
    "@/assets/imgs/catalog/children-family/early-learning.webp"
  ),
  "children-family/speech-therapy.webp": require(
    "@/assets/imgs/catalog/children-family/speech-therapy.webp"
  ),
  "children-family/playrooms.webp": require(
    "@/assets/imgs/catalog/children-family/playrooms.webp"
  ),
  "children-family/creative-clubs.webp": require(
    "@/assets/imgs/catalog/children-family/creative-clubs.webp"
  ),
  "children-family/children-products.webp": require(
    "@/assets/imgs/catalog/children-family/children-products.webp"
  ),
  "children-family/baby-equipment-rental.webp": require(
    "@/assets/imgs/catalog/children-family/baby-equipment-rental.webp"
  ),
  "education/school-preparation.webp": require(
    "@/assets/imgs/catalog/education/school-preparation.webp"
  ),
  "education/tutoring.webp": require(
    "@/assets/imgs/catalog/education/tutoring.webp"
  ),
  "education/exam-preparation.webp": require(
    "@/assets/imgs/catalog/education/exam-preparation.webp"
  ),
  "education/foreign-languages.webp": require(
    "@/assets/imgs/catalog/education/foreign-languages.webp"
  ),
  "education/arabic-language.webp": require(
    "@/assets/imgs/catalog/education/arabic-language.webp"
  ),
  "education/programming.webp": require(
    "@/assets/imgs/catalog/education/programming.webp"
  ),
  "education/vocational-training.webp": require(
    "@/assets/imgs/catalog/education/vocational-training.webp"
  ),
  "education/craft-training.webp": require(
    "@/assets/imgs/catalog/education/craft-training.webp"
  ),
  "education/driving-schools.webp": require(
    "@/assets/imgs/catalog/education/driving-schools.webp"
  ),
  "sports/fitness-training.webp": require(
    "@/assets/imgs/catalog/sports/fitness-training.webp"
  ),
  "sports/martial-arts.webp": require(
    "@/assets/imgs/catalog/sports/martial-arts.webp"
  ),
  "sports/swimming.webp": require(
    "@/assets/imgs/catalog/sports/swimming.webp"
  ),
  "sports/team-sports.webp": require(
    "@/assets/imgs/catalog/sports/team-sports.webp"
  ),
  "sports/gymnastics.webp": require(
    "@/assets/imgs/catalog/sports/gymnastics.webp"
  ),
  "sports/horse-riding.webp": require(
    "@/assets/imgs/catalog/sports/horse-riding.webp"
  ),
  "sports/venue-rental.webp": require(
    "@/assets/imgs/catalog/sports/venue-rental.webp"
  ),
  "sports/sports-goods.webp": require(
    "@/assets/imgs/catalog/sports/sports-goods.webp"
  ),
  "sports/sports-nutrition-original.webp": require(
    "@/assets/imgs/catalog/sports/sports-nutrition-original.webp"
  ),
  "clothing-tailoring/womens-clothing.webp": require(
    "@/assets/imgs/catalog/clothing-tailoring/womens-clothing.webp"
  ),
  "clothing-tailoring/mens-clothing-original.webp": require(
    "@/assets/imgs/catalog/clothing-tailoring/mens-clothing-original.webp"
  ),
  "clothing-tailoring/childrens-clothing.webp": require(
    "@/assets/imgs/catalog/clothing-tailoring/childrens-clothing.webp"
  ),
  "clothing-tailoring/hijabs-scarves.webp": require(
    "@/assets/imgs/catalog/clothing-tailoring/hijabs-scarves.webp"
  ),
  "clothing-tailoring/shoes.webp": require(
    "@/assets/imgs/catalog/clothing-tailoring/shoes.webp"
  ),
  "clothing-tailoring/bags-accessories.webp": require(
    "@/assets/imgs/catalog/clothing-tailoring/bags-accessories.webp"
  ),
  "clothing-tailoring/custom-tailoring.webp": require(
    "@/assets/imgs/catalog/clothing-tailoring/custom-tailoring.webp"
  ),
  "clothing-tailoring/clothing-repair.webp": require(
    "@/assets/imgs/catalog/clothing-tailoring/clothing-repair.webp"
  ),
  "clothing-tailoring/shoe-repair.webp": require(
    "@/assets/imgs/catalog/clothing-tailoring/shoe-repair.webp"
  ),
  "weddings-events/wedding-planning.webp": require(
    "@/assets/imgs/catalog/weddings-events/wedding-planning.webp"
  ),
  "weddings-events/nikah-planning.webp": require(
    "@/assets/imgs/catalog/weddings-events/nikah-planning.webp"
  ),
  "weddings-events/banquet-halls.webp": require(
    "@/assets/imgs/catalog/weddings-events/banquet-halls.webp"
  ),
  "weddings-events/chefs.webp": require(
    "@/assets/imgs/catalog/weddings-events/chefs.webp"
  ),
  "weddings-events/event-staff.png": require(
    "@/assets/imgs/catalog/weddings-events/event-staff.png"
  ),
  "weddings-events/event-decor.webp": require(
    "@/assets/imgs/catalog/weddings-events/event-decor.webp"
  ),
  "weddings-events/photographers.webp": require(
    "@/assets/imgs/catalog/weddings-events/photographers.webp"
  ),
  "weddings-events/videographers.webp": require(
    "@/assets/imgs/catalog/weddings-events/videographers.webp"
  ),
  "weddings-events/hosts.webp": require(
    "@/assets/imgs/catalog/weddings-events/hosts.webp"
  ),
  "weddings-events/outfit-rental.webp": require(
    "@/assets/imgs/catalog/weddings-events/outfit-rental.webp"
  ),
  "flowers-gifts/bouquets.webp": require(
    "@/assets/imgs/catalog/flowers-gifts/bouquets.webp"
  ),
  "flowers-gifts/flower-arrangements.webp": require(
    "@/assets/imgs/catalog/flowers-gifts/flower-arrangements.webp"
  ),
  "flowers-gifts/houseplants.webp": require(
    "@/assets/imgs/catalog/flowers-gifts/houseplants.webp"
  ),
  "flowers-gifts/gift-sets-original.webp": require(
    "@/assets/imgs/catalog/flowers-gifts/gift-sets-original.webp"
  ),
  "flowers-gifts/personalized-gifts.webp": require(
    "@/assets/imgs/catalog/flowers-gifts/personalized-gifts.webp"
  ),
  "travel-leisure/hotels-original.webp": require(
    "@/assets/imgs/catalog/travel-leisure/hotels-original.webp"
  ),
  "travel-leisure/guesthouses.webp": require(
    "@/assets/imgs/catalog/travel-leisure/guesthouses.webp"
  ),
  "travel-leisure/recreation-centers.webp": require(
    "@/assets/imgs/catalog/travel-leisure/recreation-centers.webp"
  ),
  "travel-leisure/holiday-cottages.webp": require(
    "@/assets/imgs/catalog/travel-leisure/holiday-cottages.webp"
  ),
  "travel-leisure/excursions-original.webp": require(
    "@/assets/imgs/catalog/travel-leisure/excursions-original.webp"
  ),
  "travel-leisure/guided-hikes.webp": require(
    "@/assets/imgs/catalog/travel-leisure/guided-hikes.webp"
  ),
  "travel-leisure/family-entertainment.webp": require(
    "@/assets/imgs/catalog/travel-leisure/family-entertainment.webp"
  ),
  "travel-leisure/travel-agencies.webp": require(
    "@/assets/imgs/catalog/travel-leisure/travel-agencies.webp"
  ),
  "travel-leisure/umrah.webp": require(
    "@/assets/imgs/catalog/travel-leisure/umrah.webp"
  ),
  "travel-leisure/hajj.webp": require(
    "@/assets/imgs/catalog/travel-leisure/hajj.webp"
  ),
  "real-estate/apartment-rental.webp": require(
    "@/assets/imgs/catalog/real-estate/apartment-rental.webp"
  ),
  "real-estate/house-rental.webp": require(
    "@/assets/imgs/catalog/real-estate/house-rental.webp"
  ),
  "real-estate/property-sales-original.webp": require(
    "@/assets/imgs/catalog/real-estate/property-sales-original.webp"
  ),
  "real-estate/new-buildings.webp": require(
    "@/assets/imgs/catalog/real-estate/new-buildings.webp"
  ),
  "real-estate/land.webp": require(
    "@/assets/imgs/catalog/real-estate/land.webp"
  ),
  "real-estate/commercial-property.webp": require(
    "@/assets/imgs/catalog/real-estate/commercial-property.webp"
  ),
  "real-estate/realtors.webp": require(
    "@/assets/imgs/catalog/real-estate/realtors.webp"
  ),
  "business-services/accounting.webp": require(
    "@/assets/imgs/catalog/business-services/accounting.webp"
  ),
  "business-services/legal.webp": require(
    "@/assets/imgs/catalog/business-services/legal.webp"
  ),
  "business-services/business-registration.webp": require(
    "@/assets/imgs/catalog/business-services/business-registration.webp"
  ),
  "business-services/branding.webp": require(
    "@/assets/imgs/catalog/business-services/branding.webp"
  ),
  "business-services/web-apps.webp": require(
    "@/assets/imgs/catalog/business-services/web-apps.webp"
  ),
  "business-services/advertising-social-original.webp": require(
    "@/assets/imgs/catalog/business-services/advertising-social-original.webp"
  ),
  "business-services/product-photography.webp": require(
    "@/assets/imgs/catalog/business-services/product-photography.webp"
  ),
  "business-services/printing-signs.webp": require(
    "@/assets/imgs/catalog/business-services/printing-signs.webp"
  ),
  "business-services/translation.webp": require(
    "@/assets/imgs/catalog/business-services/translation.webp"
  ),
  "business-services/recruitment.webp": require(
    "@/assets/imgs/catalog/business-services/recruitment.webp"
  ),
  "garden-farming/landscaping.webp": require(
    "@/assets/imgs/catalog/garden-farming/landscaping.webp"
  ),
  "garden-farming/tree-pruning.webp": require(
    "@/assets/imgs/catalog/garden-farming/tree-pruning.webp"
  ),
  "garden-farming/lawns.webp": require(
    "@/assets/imgs/catalog/garden-farming/lawns.webp"
  ),
  "garden-farming/irrigation-greenhouses.webp": require(
    "@/assets/imgs/catalog/garden-farming/irrigation-greenhouses.webp"
  ),
  "garden-farming/seedlings-seeds.webp": require(
    "@/assets/imgs/catalog/garden-farming/seedlings-seeds.webp"
  ),
  "garden-farming/garden-tools.webp": require(
    "@/assets/imgs/catalog/garden-farming/garden-tools.webp"
  ),
  "garden-farming/garden-tool-repair.webp": require(
    "@/assets/imgs/catalog/garden-farming/garden-tool-repair.webp"
  ),
  "garden-farming/animal-supplies.webp": require(
    "@/assets/imgs/catalog/garden-farming/animal-supplies.webp"
  ),
  "garden-farming/veterinary.webp": require(
    "@/assets/imgs/catalog/garden-farming/veterinary.webp"
  ),
  "religion-community/quran-reading.webp": require(
    "@/assets/imgs/catalog/religion-community/quran-reading.webp"
  ),
  "religion-community/tajweed.webp": require(
    "@/assets/imgs/catalog/religion-community/tajweed.webp"
  ),
  "religion-community/quran-memorization.webp": require(
    "@/assets/imgs/catalog/religion-community/quran-memorization.webp"
  ),
  "religion-community/islam-basics.webp": require(
    "@/assets/imgs/catalog/religion-community/islam-basics.webp"
  ),
  "religion-community/islamic-books.webp": require(
    "@/assets/imgs/catalog/religion-community/islamic-books.webp"
  ),
  "religion-community/prayer-supplies.webp": require(
    "@/assets/imgs/catalog/religion-community/prayer-supplies.webp"
  ),
  "religion-community/community-meetings.webp": require(
    "@/assets/imgs/catalog/religion-community/community-meetings.webp"
  ),
  "religion-community/mosques-centers.webp": require(
    "@/assets/imgs/catalog/religion-community/mosques-centers.webp"
  ),
};
