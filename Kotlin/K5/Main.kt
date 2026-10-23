fun main() {

    println("==============================================")
    println("        WANDERLY SMART TRAVEL PLANNER")
    println("        TRAVELER MANAGEMENT SYSTEM")
    println("==============================================")


    // --------------------------------------------------
    // 1. Create Traveler Objects
    // --------------------------------------------------

    val traveler1 = StudentTraveler(
        travelerId = "TRV-101",
        name = "Stuti Yewle",
        email = "stuti@wanderly.com",
        age = 21,
        interests = setOf(
            "Beaches",
            "Mountains",
            "Photography"
        ),
        collegeName = "Engineering College",
        isStudentMember = true
    )


    val traveler2 = StudentTraveler(
        travelerId = "TRV-102",
        name = "Ananya Iyer",
        email = "ananya@wanderly.com",
        age = 21,
        interests = setOf(
            "Historical Places",
            "Photography",
            "Food"
        ),
        collegeName = "Engineering College",
        isStudentMember = false
    )


    val traveler3 = ProfessionalTraveler(
        travelerId = "TRV-201",
        name = "Rohan Verma",
        email = "rohan@wanderly.com",
        age = 29,
        interests = setOf(
            "Adventure",
            "Mountains",
            "Camping"
        ),
        companyName = "Tech Innovations Pvt Ltd"
    )


    // --------------------------------------------------
    // 2. Store Travelers in a List
    // --------------------------------------------------

    val travelerList: List<Traveler> = listOf(
        traveler1,
        traveler2,
        traveler3
    )


    // --------------------------------------------------
    // 3. Display All Travelers
    // --------------------------------------------------

    println("\n--- REGISTERED TRAVELERS ---")

    travelerList.forEach { traveler ->
        println(traveler.getDetails())
    }


    // --------------------------------------------------
    // 4. Filter Travelers Interested in Mountains
    // --------------------------------------------------

    println("\n--- TRAVELERS INTERESTED IN MOUNTAINS ---")

    val mountainTravelers = travelerList.filter { traveler ->
        "Mountains" in traveler.interests
    }

    mountainTravelers.forEach { traveler ->
        println(
            "${traveler.travelerId} - ${traveler.name}"
        )
    }


    // --------------------------------------------------
    // 5. Collect All Unique Travel Interests
    // --------------------------------------------------

    println("\n--- ALL UNIQUE TRAVEL INTERESTS ---")

    val allInterests: Set<String> =
        travelerList
            .flatMap { traveler ->
                traveler.interests
            }
            .toSet()

    println(
        allInterests.joinToString(", ")
    )

    println(
        "Total Unique Interests: ${allInterests.size}"
    )


    // --------------------------------------------------
    // 6. Calculate Total Wanderly Planning Revenue
    // --------------------------------------------------

    val totalRevenue =
        travelerList.sumOf { traveler ->
            traveler.calculatePlanningFee()
        }

    println("\n--- WANDERLY PLANNING REVENUE ---")

    println(
        "Total Planning Revenue: ₹$totalRevenue"
    )


    // --------------------------------------------------
    // 7. Search Traveler Using Traveler ID
    // --------------------------------------------------

    val searchId = "TRV-101"

    println("\n--- TRAVELER SEARCH ---")

    println(
        "Searching for Traveler ID: $searchId"
    )


    val searchedTraveler =
        travelerList.find { traveler ->
            traveler.travelerId == searchId
        }


    if (searchedTraveler != null) {

        println("Traveler Found!")

        println(
            "Name: ${searchedTraveler.name}"
        )

        println(
            "Email: ${searchedTraveler.email}"
        )

        println(
            "Age: ${searchedTraveler.age}"
        )

    } else {

        println("Traveler not found.")
    }


    // --------------------------------------------------
    // 8. Demonstrate Polymorphism
    // --------------------------------------------------

    println("\n--- POLYMORPHISM DEMONSTRATION ---")

    for (traveler in travelerList) {

        println(
            "${traveler.name} -> Planning Fee: ₹" +
                    traveler.calculatePlanningFee()
        )
    }


    // --------------------------------------------------
    // Program Completed
    // --------------------------------------------------

    println("\n==============================================")
    println("        WANDERLY PROGRAM COMPLETED")
    println("==============================================")
}