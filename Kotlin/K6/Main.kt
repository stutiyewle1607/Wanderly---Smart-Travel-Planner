fun main() {

    println("==============================================")
    println("        WANDERLY SMART TRAVEL PLANNER")
    println("        TRIP PACKAGE FEE PROCESSOR")
    println("==============================================")


    // --------------------------------------------------
    // Raw Wanderly trip package fees
    // Contains valid values and one invalid entry
    // --------------------------------------------------

    val rawPackageFees = listOf(
        "500",
        "invalid_entry",
        "300",
        "800",
        "1200"
    )


    // List to store successfully parsed fees
    val validPackageFees = mutableListOf<Int>()


    // --------------------------------------------------
    // PHASE 1: Exception Handling
    // --------------------------------------------------

    println("\n--- PHASE 1: PARSING PACKAGE FEES WITH EXCEPTION HANDLING ---")


    for (input in rawPackageFees) {

        try {

            // Convert String to Integer
            // Invalid text will throw NumberFormatException
            val fee = input.toInt()

            validPackageFees.add(fee)

        } catch (e: NumberFormatException) {

            println(
                "Exception Handled: Unable to parse '$input', skipping entry."
            )
        }
    }


    println("\nParsed Valid Package Fees: $validPackageFees")


    // --------------------------------------------------
    // PHASE 2: FILTER
    // --------------------------------------------------
    // Keep only standard/premium packages
    // costing ₹400 or more
    // --------------------------------------------------

    println("\n--- PHASE 2: FILTERING PACKAGE FEES ---")


    val premiumFees =
        validPackageFees.filter { fee ->
            fee >= 400
        }


    println(
        "Premium Package Fees (>= ₹400): $premiumFees"
    )


    // --------------------------------------------------
    // PHASE 3: MAP
    // --------------------------------------------------
    // Apply a 10% early-bird discount
    // --------------------------------------------------

    println("\n--- PHASE 3: APPLYING EARLY-BIRD DISCOUNT ---")


    val discountedFees =
        premiumFees.map { fee ->
            fee * 0.9
        }


    println(
        "Discounted Fees (10% off): $discountedFees"
    )


    // --------------------------------------------------
    // PHASE 4: REDUCE
    // --------------------------------------------------
    // Calculate the total collection
    // --------------------------------------------------

    println("\n--- PHASE 4: CALCULATING TOTAL COLLECTION ---")


    val totalRevenue =
        discountedFees.reduce { total, fee ->
            total + fee
        }


    println(
        "Total Wanderly Revenue Raised: ₹$totalRevenue"
    )


    // --------------------------------------------------
    // PROGRAM COMPLETED
    // --------------------------------------------------

    println("\n==============================================")
    println("        WANDERLY PROCESSING COMPLETED")
    println("==============================================")
}