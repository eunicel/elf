import mysql.connector
import urllib2
import datetime

# USE THIS FOR REGULAR DICTIONARY ATTACK
#wl = open('/usr/share/dict/words', 'r')
# USE THIS FOR SHOUTKEY DICTIONARY ATTACK
wl = open('/Users/eunice/Dropbox (MIT)/MIT/Year4/Spring/6.857/elf/shoutkey_dictionary.txt', 'r')
wordlist = wl.readlines()
wl.close()

def get_redirected_url(url):
    try:
    	opener = urllib2.build_opener(urllib2.HTTPRedirectHandler)
    	request = opener.open(url)
    	return request.url
    except:
	print "ERROR OCCURRED"

# set up a database to store the redirect urls
url_data = mysql.connector.connect(host='localhost',
        user='root',
        password='',
        db='urls') # The name of the database we are using is urls

cursor = url_data.cursor()

#drop_stmt = ( 
#        'DROP TABLE IF EXISTS urls'
#)
#cursor.execute(drop_stmt)

# USE THIS FOR REGULAR DICTIONARY ATTACK
#create_stmt = ( 
#        'CREATE TABLE IF NOT EXISTS urls'
#        ' (WORD CHAR(30), REDIRECT_URL CHAR(255), TIMESTAMP CHAR(30))'
#)

# USE THIS FOR SHOUTKEY DICTIONARY ATTACK
create_stmt = (
	'CREATE TABLE IF NOT EXISTS shoutkey_attack'
	' (WORD CHAR(30), REDIRECT_URL CHAR(255), TIMESTAMP CHAR(30))'
)

cursor.execute(create_stmt)
# USE THIS FOR REGULAR DICTIONARY ATTACK
#insert_stmt = 'INSERT IGNORE INTO urls (WORD, REDIRECT_URL, TIMESTAMP) VALUES (%s, %s, %s)'

# USE THIS FOR SHOUTKEY DICTIONARY ATTACK
insert_stmt = 'INSERT IGNORE INTO shoutkey_attack (WORD, REDIRECT_URL, TIMESTAMP) VALUES (%s, %s, %s)'

starttime = datetime.datetime.now()
num_redirected = 0
for word in wordlist:
	word = word[0:len(word)-1] # strips off newline at the end
	original_url = "http://shoutkey.com/" + word
	redirected_url = get_redirected_url(original_url)
	if redirected_url == original_url or redirected_url == "http://shoutkey.com/" or redirected_url == "http://shoutkey.com/system/" or redirected_url == "http://shoutkey.com/application/":
		# did not redirect
		print word, " did not redirect"
		cursor.execute(insert_stmt, (word, None, datetime.datetime.now()))
		url_data.commit()
	else:
		# redirected
		print word, " redirected to ", redirected_url
		num_redirected += 1
		cursor.execute(insert_stmt, (word, redirected_url, datetime.datetime.now()))
		url_data.commit()

totaltime = datetime.datetime.now() - starttime
print totaltime
print "TOTAL NUMBER OF WORDS = ", len(wordlist)
print "NUMBER OF REDIRECTS = ", num_redirected
url_data.close()
		
